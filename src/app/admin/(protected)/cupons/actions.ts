"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";

const ROLES = ["super_admin", "admin"] as const;

function str(v: FormDataEntryValue | null) {
  if (v === null) return null;
  const s = v.toString().trim();
  return s === "" ? null : s;
}

function num(v: FormDataEntryValue | null) {
  const s = str(v);
  return s === null ? null : Number(s);
}

export async function createCoupon(formData: FormData) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();

  const code = str(formData.get("code"))!.toUpperCase();
  const type = (str(formData.get("type")) ?? "percent") as "percent" | "fixed";
  const value = num(formData.get("value"))!;
  const minOrderValue = num(formData.get("min_order_value")) ?? 0;
  const usageLimit = num(formData.get("usage_limit"));
  const startsAt = str(formData.get("starts_at"));
  const expiresAt = str(formData.get("expires_at"));
  const active = formData.get("active") === "on";

  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code,
      type,
      value,
      min_order_value: minOrderValue,
      usage_limit: usageLimit,
      starts_at: startsAt,
      expires_at: expiresAt,
      active,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Não foi possível criar o cupom.");
  await logAdminAction(admin, "create", "coupon", data.id, { code, type, value });
  revalidatePath("/admin/cupons");
  redirect("/admin/cupons");
}

export async function updateCoupon(couponId: string, formData: FormData) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();

  const code = str(formData.get("code"))!.toUpperCase();
  const type = (str(formData.get("type")) ?? "percent") as "percent" | "fixed";
  const value = num(formData.get("value"))!;
  const minOrderValue = num(formData.get("min_order_value")) ?? 0;
  const usageLimit = num(formData.get("usage_limit"));
  const startsAt = str(formData.get("starts_at"));
  const expiresAt = str(formData.get("expires_at"));
  const active = formData.get("active") === "on";

  const { error } = await supabase
    .from("coupons")
    .update({
      code,
      type,
      value,
      min_order_value: minOrderValue,
      usage_limit: usageLimit,
      starts_at: startsAt,
      expires_at: expiresAt,
      active,
    })
    .eq("id", couponId);

  if (error) throw new Error(error.message);
  await logAdminAction(admin, "update", "coupon", couponId, { code, type, value });
  revalidatePath("/admin/cupons");
  redirect("/admin/cupons");
}

export async function toggleCouponActive(couponId: string, active: boolean) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").update({ active }).eq("id", couponId);
  if (error) throw new Error(error.message);
  await logAdminAction(admin, active ? "activate" : "deactivate", "coupon", couponId);
  revalidatePath("/admin/cupons");
}

export async function deleteCoupon(couponId: string) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", couponId);
  if (error) throw new Error(error.message);
  await logAdminAction(admin, "delete", "coupon", couponId);
  revalidatePath("/admin/cupons");
}
