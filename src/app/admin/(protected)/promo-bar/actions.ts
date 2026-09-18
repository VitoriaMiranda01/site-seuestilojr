"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";

const ROLES = ["super_admin", "admin", "editor_marketing"] as const;

export async function createPromoMessage(formData: FormData) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const message = formData.get("message")?.toString().trim();
  if (!message) throw new Error("Mensagem obrigatória.");

  const { count } = await supabase.from("promo_messages").select("*", { count: "exact", head: true });
  const { data, error } = await supabase.from("promo_messages").insert({ message, sort_order: count ?? 0 }).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao criar mensagem.");
  await logAdminAction(admin, "create", "promo_message", data.id, { message });
  revalidatePath("/admin/promo-bar");
}

export async function togglepromoMessage(id: string, active: boolean) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  await supabase.from("promo_messages").update({ active }).eq("id", id);
  await logAdminAction(admin, active ? "activate" : "deactivate", "promo_message", id);
  revalidatePath("/admin/promo-bar");
}

export async function deletePromoMessage(id: string) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  await supabase.from("promo_messages").delete().eq("id", id);
  await logAdminAction(admin, "delete", "promo_message", id);
  revalidatePath("/admin/promo-bar");
}

export async function reorderPromoMessage(id: string, direction: "up" | "down") {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const { data: messages } = await supabase.from("promo_messages").select("id, sort_order").order("sort_order");
  if (!messages) return;
  const idx = messages.findIndex((m) => m.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= messages.length) return;
  const a = messages[idx];
  const b = messages[swapIdx];
  await supabase.from("promo_messages").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("promo_messages").update({ sort_order: a.sort_order }).eq("id", b.id);
  await logAdminAction(admin, "reorder", "promo_message", id);
  revalidatePath("/admin/promo-bar");
}
