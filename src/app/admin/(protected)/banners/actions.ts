"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";

const ROLES = ["super_admin", "admin", "editor_marketing"] as const;

function str(v: FormDataEntryValue | null) {
  if (v === null) return null;
  const s = v.toString().trim();
  return s === "" ? null : s;
}

function payloadFromForm(formData: FormData) {
  return {
    title: str(formData.get("title"))!,
    subtitle: str(formData.get("subtitle")),
    image_url: str(formData.get("image_url"))!,
    mobile_image_url: str(formData.get("mobile_image_url")),
    button_text: str(formData.get("button_text")),
    link_url: str(formData.get("link_url")),
    placement: (str(formData.get("placement")) ?? "hero") as "hero" | "collection",
    starts_at: str(formData.get("starts_at")),
    ends_at: str(formData.get("ends_at")),
    active: formData.get("active") === "on",
  };
}

export async function createBanner(formData: FormData) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const { count } = await supabase.from("banners").select("*", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("banners")
    .insert({ ...payloadFromForm(formData), sort_order: count ?? 0 })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Não foi possível criar o banner.");
  await logAdminAction(admin, "create", "banner", data.id);
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function updateBanner(bannerId: string, formData: FormData) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const { error } = await supabase.from("banners").update(payloadFromForm(formData)).eq("id", bannerId);
  if (error) throw new Error(error.message);
  await logAdminAction(admin, "update", "banner", bannerId);
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function deleteBanner(bannerId: string) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  await supabase.from("banners").delete().eq("id", bannerId);
  await logAdminAction(admin, "delete", "banner", bannerId);
  revalidatePath("/admin/banners");
}

export async function reorderBanner(bannerId: string, direction: "up" | "down") {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const { data: banners } = await supabase.from("banners").select("id, sort_order").order("sort_order");
  if (!banners) return;
  const idx = banners.findIndex((b) => b.id === bannerId);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= banners.length) return;
  const a = banners[idx];
  const b = banners[swapIdx];
  await supabase.from("banners").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("banners").update({ sort_order: a.sort_order }).eq("id", b.id);
  await logAdminAction(admin, "reorder", "banner", bannerId);
  revalidatePath("/admin/banners");
}
