import { NextResponse } from "next/server";
import { calculateShipping } from "@/lib/shipping";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.subtotal !== "number" || typeof body.cep !== "string") {
    return NextResponse.json({ error: "Informe subtotal e CEP." }, { status: 400 });
  }
  try {
    const quote = await calculateShipping(body.subtotal, body.cep);
    return NextResponse.json(quote);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Não foi possível calcular o frete.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
