import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdminRole(["super_admin", "admin", "atendimento"]);
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*), order_status_history(*), profiles(full_name, email, phone)")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const address = order.shipping_address as {
    recipient_name: string; street: string; number: string; complement: string | null;
    neighborhood: string; city: string; state: string; zip_code: string;
  };

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 font-display text-3xl font-semibold text-ink">Pedido #{order.order_number}</h1>
      <p className="mb-6 text-sm text-brown-400">{formatDate(order.created_at)}</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h2 className="mb-3 font-medium text-ink">Itens do pedido</h2>
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-brown-600">
                  <span>{item.quantity}x {item.product_name} {item.variant_label && `(${item.variant_label})`}</span>
                  <span>{formatCurrency(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-cream-300 pt-3 text-sm">
              <div className="flex justify-between text-brown-400"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-700"><span>Desconto {order.coupon_code && `(${order.coupon_code})`}</span><span>-{formatCurrency(order.discount)}</span></div>}
              <div className="flex justify-between text-brown-400"><span>Frete</span><span>{formatCurrency(order.shipping_cost)}</span></div>
              <div className="flex justify-between font-display text-lg font-semibold text-ink"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h2 className="mb-3 font-medium text-ink">Cliente e entrega</h2>
            <p className="text-sm text-brown-600">
              {order.profiles?.full_name ?? order.guest_name} — {order.profiles?.email ?? order.guest_email}
              {order.guest_phone && ` — ${order.guest_phone}`}
            </p>
            <p className="mt-2 text-sm text-brown-500">
              {address.street}, {address.number} {address.complement && `- ${address.complement}`}<br />
              {address.neighborhood}, {address.city}/{address.state} — {address.zip_code}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h2 className="mb-3 font-medium text-ink">Histórico</h2>
            <div className="space-y-2 text-sm text-brown-500">
              {order.order_status_history
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((h) => (
                  <div key={h.id} className="flex justify-between border-b border-cream-200 pb-2">
                    <span>{ORDER_STATUS_LABELS[h.status]} {h.note && `— ${h.note}`}</span>
                    <span className="text-xs text-brown-300">{formatDate(h.created_at)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          <div className="rounded-2xl bg-white p-5 shadow-card text-sm">
            <p className="mb-2 font-medium text-ink">Pagamento</p>
            <p className="text-brown-500">Método: {order.payment_method ?? "—"}</p>
            <p className="text-brown-500">Status: {order.payment_status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
