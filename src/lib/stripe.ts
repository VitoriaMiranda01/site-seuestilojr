import "server-only";
import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY não configurada. Adicione suas chaves da Stripe nas variáveis de ambiente para habilitar o checkout.",
    );
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, { apiVersion: "2024-06-20" });
  }
  return stripeSingleton;
}
