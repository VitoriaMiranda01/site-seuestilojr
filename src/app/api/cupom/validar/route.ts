import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.code !== "string" || typeof body.subtotal !== "number") {
    return NextResponse.json({ error: "Informe o cupom e o subtotal." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: coupon, error } = await supabase.rpc("validate_coupon", {
    p_code: body.code,
    p_order_total: body.subtotal,
  });

  if (error || !coupon) {
    const messages: Record<string, string> = {
      coupon_not_found: "Cupom não encontrado.",
      coupon_not_started: "Este cupom ainda não está disponível.",
      coupon_expired: "Este cupom expirou.",
      coupon_exhausted: "Este cupom já atingiu o limite de uso.",
      coupon_min_value_not_met: "O valor mínimo para este cupom não foi atingido.",
    };
    const code = error?.message?.split(":").pop()?.trim() ?? "";
    return NextResponse.json({ error: messages[code] ?? "Cupom inválido." }, { status: 400 });
  }

  const discount = coupon.type === "percent" ? Math.round(body.subtotal * (coupon.value / 100) * 100) / 100 : coupon.value;

  return NextResponse.json({ code: coupon.code, type: coupon.type, value: coupon.value, discount });
}
