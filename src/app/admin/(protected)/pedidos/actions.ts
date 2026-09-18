"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";
import type { Enums } from "@/lib/supabase/types";

const ROLES = ["super_admin", "admin", "atendimento"] as const;

export async function updateOrderStatus(orderId: string, status: Enums<"order_status">, note?: string) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);

  // A trigger already records this status change in order_status_history;
  // when a note is provided, attach it to that just-created row instead of
  // inserting a duplicate entry.
  if (note) {
    const { data: lastHistory } = await supabase
      .from("order_status_history")
      .select("id")
      .eq("order_id", orderId)
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lastHistory) {
      await supabase.from("order_status_history").update({ note }).eq("id", lastHistory.id);
    }
  }

  await logAdminAction(admin, "update_status", "order", orderId, { status, note });
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
}
