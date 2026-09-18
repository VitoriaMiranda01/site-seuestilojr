import { createClient } from "./supabase/server";

export type ShippingQuote = {
  cost: number;
  freeShipping: boolean;
  etaDays: number;
};

/**
 * Simplified shipping calculation based on store-configured rules
 * (flat rate + free-shipping threshold, both editable in
 * /admin/configuracoes). The CEP is validated and stored with the order so
 * a real carrier integration (Correios, Melhor Envio...) can be plugged in
 * later without changing the checkout flow.
 */
export async function calculateShipping(subtotal: number, cep: string): Promise<ShippingQuote> {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) {
    throw new Error("CEP inválido. Informe um CEP com 8 dígitos.");
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["shipping_flat_rate", "free_shipping_threshold"]);

  const flatRate = Number(data?.find((s) => s.key === "shipping_flat_rate")?.value ?? 25);
  const freeThreshold = Number(data?.find((s) => s.key === "free_shipping_threshold")?.value ?? 299);

  const freeShipping = subtotal >= freeThreshold;
  return {
    cost: freeShipping ? 0 : flatRate,
    freeShipping,
    etaDays: 7,
  };
}
