import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { calculateShipping } from "@/lib/shipping";
import { checkoutSchema } from "@/lib/checkout-schema";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados de checkout inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }
  const payload = parsed.data;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user && !payload.guestEmail) {
    return NextResponse.json({ error: "Informe um e-mail para continuar como visitante." }, { status: 400 });
  }

  // Re-price every item from the database — never trust client-sent prices.
  const kitItems = payload.items.filter((i) => i.isKit);
  const productItems = payload.items.filter((i) => !i.isKit);

  const [{ data: dbProducts, error: productsError }, { data: dbKits, error: kitsError }] = await Promise.all([
    productItems.length
      ? supabase
          .from("products")
          .select("id, name, price, sale_price, stock, active, product_images(url, sort_order), product_variants(*)")
          .in("id", productItems.map((i) => i.productId))
      : Promise.resolve({ data: [], error: null }),
    kitItems.length
      ? supabase.from("product_kits").select("id, name, price, image_url, active").in("id", kitItems.map((i) => i.productId))
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (productsError || kitsError || !dbProducts || !dbKits) {
    return NextResponse.json({ error: "Não foi possível validar os produtos do carrinho." }, { status: 500 });
  }

  let subtotal = 0;
  const orderItemsInput: {
    product_id: string | null;
    variant_id: string | null;
    product_name: string;
    variant_label: string | null;
    unit_price: number;
    quantity: number;
    image_url: string | null;
  }[] = [];

  for (const item of productItems) {
    const product = dbProducts.find((p) => p.id === item.productId);
    if (!product || !product.active) {
      return NextResponse.json({ error: `Produto indisponível: ${item.name}` }, { status: 409 });
    }
    const variant = item.variantId ? product.product_variants?.find((v) => v.id === item.variantId) : null;
    const unitPrice = variant?.price_override ?? product.sale_price ?? product.price;
    const stock = variant ? variant.stock : product.stock;
    if (stock < item.quantity) {
      return NextResponse.json({ error: `Estoque insuficiente para: ${product.name}` }, { status: 409 });
    }
    subtotal += unitPrice * item.quantity;
    const sortedImages = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    orderItemsInput.push({
      product_id: product.id,
      variant_id: variant?.id ?? null,
      product_name: product.name,
      variant_label: item.variantLabel,
      unit_price: unitPrice,
      quantity: item.quantity,
      image_url: sortedImages[0]?.url ?? null,
    });
  }

  for (const item of kitItems) {
    const kit = dbKits.find((k) => k.id === item.productId);
    if (!kit || !kit.active) {
      return NextResponse.json({ error: `Kit indisponível: ${item.name}` }, { status: 409 });
    }
    subtotal += kit.price * item.quantity;
    orderItemsInput.push({
      product_id: null,
      variant_id: null,
      product_name: `${kit.name} (Kit)`,
      variant_label: null,
      unit_price: kit.price,
      quantity: item.quantity,
      image_url: kit.image_url,
    });
  }

  let discount = 0;
  let couponCode: string | null = null;
  if (payload.couponCode) {
    const { data: coupon, error: couponError } = await supabase.rpc("validate_coupon", {
      p_code: payload.couponCode,
      p_order_total: subtotal,
    });
    if (couponError || !coupon) {
      return NextResponse.json({ error: "Cupom inválido ou expirado." }, { status: 400 });
    }
    discount = coupon.type === "percent" ? Math.round(subtotal * (coupon.value / 100) * 100) / 100 : coupon.value;
    couponCode = coupon.code;
  }

  const afterDiscount = Math.max(subtotal - discount, 0);
  const shipping = await calculateShipping(afterDiscount, payload.address.zipCode);
  const total = Math.round((afterDiscount + shipping.cost) * 100) / 100;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      profile_id: userData.user?.id ?? null,
      guest_email: userData.user ? null : payload.guestEmail,
      guest_name: userData.user ? null : payload.guestName,
      guest_phone: userData.user ? null : payload.guestPhone,
      status: "pending",
      payment_status: "pending",
      payment_method: payload.paymentMethod === "pix" ? "pix" : "credit_card",
      subtotal,
      discount,
      shipping_cost: shipping.cost,
      total,
      coupon_code: couponCode,
      shipping_address: {
        recipient_name: payload.address.recipientName,
        zip_code: payload.address.zipCode,
        street: payload.address.street,
        number: payload.address.number,
        complement: payload.address.complement ?? null,
        neighborhood: payload.address.neighborhood,
        city: payload.address.city,
        state: payload.address.state,
      },
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Não foi possível criar o pedido." }, { status: 500 });
  }

  await supabase.from("order_items").insert(orderItemsInput.map((item) => ({ ...item, order_id: order.id })));

  try {
    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const lineItems = orderItemsInput.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: { name: item.product_name, images: item.image_url ? [item.image_url] : undefined },
        unit_amount: Math.round(item.unit_price * 100),
      },
      quantity: item.quantity,
    }));

    if (shipping.cost > 0) {
      lineItems.push({
        price_data: {
          currency: "brl",
          product_data: { name: "Frete", images: undefined },
          unit_amount: Math.round(shipping.cost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: payload.paymentMethod === "pix" ? ["pix"] : ["card"],
      line_items: lineItems,
      discounts: undefined,
      customer_email: userData.user?.email ?? payload.guestEmail,
      success_url: `${siteUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: { order_id: order.id, order_number: String(order.order_number) },
    });

    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao iniciar pagamento.";
    return NextResponse.json(
      {
        error:
          "Pagamento não configurado. Adicione as chaves da Stripe (STRIPE_SECRET_KEY) nas variáveis de ambiente para habilitar o checkout.",
        details: message,
        orderId: order.id,
      },
      { status: 503 },
    );
  }
}
