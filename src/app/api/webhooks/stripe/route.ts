import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "assinatura inválida";
    return NextResponse.json({ error: `Webhook inválido: ${message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (!orderId) return NextResponse.json({ received: true });

    const { data: order } = await supabase.from("orders").select("*, order_items(*)").eq("id", orderId).maybeSingle();
    if (!order || order.payment_status === "paid") {
      return NextResponse.json({ received: true });
    }

    await supabase
      .from("orders")
      .update({
        status: "paid",
        payment_status: "paid",
        stripe_payment_intent:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
      })
      .eq("id", orderId);

    // Decrement stock atomically for each item (variant stock takes priority over product stock).
    for (const item of order.order_items) {
      if (item.variant_id) {
        await supabase.rpc("decrement_variant_stock", { p_variant_id: item.variant_id, p_qty: item.quantity });
      } else if (item.product_id) {
        await supabase.rpc("decrement_product_stock", { p_product_id: item.product_id, p_qty: item.quantity });
      }
    }

    if (order.coupon_code) {
      await supabase.rpc("redeem_coupon", { p_code: order.coupon_code, p_order_total: order.subtotal });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await supabase.from("orders").update({ status: "canceled", payment_status: "canceled" }).eq("id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}
