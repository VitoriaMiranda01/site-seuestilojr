"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";
import type { Json } from "@/lib/supabase/types";
import type { SiteSettings } from "@/lib/settings";

const ROLES = ["super_admin"] as const;

function str(v: FormDataEntryValue | null) {
  if (v === null) return "";
  return v.toString().trim();
}

function nullableStr(v: FormDataEntryValue | null) {
  const s = str(v);
  return s === "" ? null : s;
}

export async function updateSiteSettings(formData: FormData) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();

  const updates: Record<string, Json> = {
    store_name: str(formData.get("store_name")) || "Seu Estilo Jr",
    logo_url: nullableStr(formData.get("logo_url")),
    favicon_url: nullableStr(formData.get("favicon_url")),
    whatsapp_number: str(formData.get("whatsapp_number")),
    instagram_url: str(formData.get("instagram_url")),
    contact_email: str(formData.get("contact_email")),
    shipping_flat_rate: Number(formData.get("shipping_flat_rate") || 0),
    free_shipping_threshold: Number(formData.get("free_shipping_threshold") || 0),
    footer_about: str(formData.get("footer_about")),
    policies_url: nullableStr(formData.get("policies_url")),
  } satisfies Record<keyof SiteSettings, Json>;

  const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);

  await logAdminAction(admin, "update", "site_settings", null, updates);
  revalidatePath("/admin/configuracoes");
  revalidatePath("/", "layout");
}
