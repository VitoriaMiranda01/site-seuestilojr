import { createClient } from "./supabase/server";

export type SiteSettings = {
  store_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp_number: string;
  instagram_url: string;
  contact_email: string;
  shipping_flat_rate: number;
  free_shipping_threshold: number;
  footer_about: string;
  policies_url: string | null;
};

const DEFAULTS: SiteSettings = {
  store_name: "Seu Estilo Jr",
  logo_url: null,
  favicon_url: null,
  whatsapp_number: "5511999999999",
  instagram_url: "https://instagram.com",
  contact_email: "contato@seuestilojr.com.br",
  shipping_flat_rate: 25,
  free_shipping_threshold: 299,
  footer_about: "Especialistas em laces, wigs e cuidados capilares.",
  policies_url: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  const map = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
  return {
    ...DEFAULTS,
    ...Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v])),
  } as SiteSettings;
}
