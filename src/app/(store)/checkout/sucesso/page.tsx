import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const supabase = await createClient();

  const { data: order } = session_id
    ? await supabase.from("orders").select("*").eq("stripe_session_id", session_id).maybeSingle()
    : { data: null };

  return (
    <div className="container-store flex flex-col items-center gap-4 py-24 text-center">
      <CheckCircle2 size={56} className="text-green-600" />
      <h1 className="font-display text-3xl font-semibold text-ink">Pedido recebido!</h1>
      {order ? (
        <div className="space-y-1 text-sm text-brown-500">
          <p>Pedido #{order.order_number}</p>
          <p>Total: {formatCurrency(order.total)}</p>
          <p>
            Status do pagamento:{" "}
            {order.payment_status === "paid" ? "Confirmado" : "Aguardando confirmação"}
          </p>
        </div>
      ) : (
        <p className="max-w-md text-sm text-brown-400">
          Recebemos seu pedido e estamos confirmando o pagamento. Você receberá uma atualização em breve.
        </p>
      )}
      <div className="flex gap-3">
        <Link href="/conta" className="btn-secondary">Meus pedidos</Link>
        <Link href="/" className="btn-primary">Continuar comprando</Link>
      </div>
    </div>
  );
}
