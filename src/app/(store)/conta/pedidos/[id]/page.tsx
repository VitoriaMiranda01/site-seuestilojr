import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*), order_status_history(*)")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const address = order.shipping_address as {
    recipient_name: string; street: string; number: string; complement: string | null;
    neighborhood: string; city: string; state: string; zip_code: string;
  };

  return (
    <div className="container-store max-w-3xl py-8">
      <Link href="/conta" className="text-sm text-brown-500 underline">← Voltar</Link>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Pedido #{order.order_number}</h1>
      <p className="text-sm text-brown-400">{formatDate(order.created_at)}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="mb-2 text-sm font-medium text-ink">Status</p>
          <p className="text-sm text-brown-600">{ORDER_STATUS_LABELS[order.status] ?? order.status}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="mb-2 text-sm font-medium text-ink">Entrega</p>
          <p className="text-sm text-brown-600">
            {address.street}, {address.number} {address.complement && `- ${address.complement}`}<br />
            {address.neighborhood}, {address.city}/{address.state} — {address.zip_code}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <p className="text-sm font-medium text-ink">Itens</p>
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-brown-600">
            <span>{item.quantity}x {item.product_name} {item.variant_label && `(${item.variant_label})`}</span>
            <span>{formatCurrency(item.unit_price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-cream-300 pt-2 text-sm">
          <div className="flex justify-between text-brown-400"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-700"><span>Desconto</span><span>-{formatCurrency(order.discount)}</span></div>}
          <div className="flex justify-between text-brown-400"><span>Frete</span><span>{formatCurrency(order.shipping_cost)}</span></div>
          <div className="flex justify-between font-display text-lg font-semibold text-ink"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
        </div>
      </div>
    </div>
  );
}
