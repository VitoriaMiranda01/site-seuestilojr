import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: productsCount }, { count: ordersCount }, { data: paidOrders }, { data: lowStock }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total").eq("payment_status", "paid"),
      supabase.from("products").select("id, name, stock").lte("stock", 5).eq("active", true).order("stock").limit(6),
      supabase.from("orders").select("id, order_number, status, total, created_at").order("created_at", { ascending: false }).limit(6),
    ]);

  const revenue = (paidOrders ?? []).reduce((sum, o) => sum + o.total, 0);

  const cards = [
    { label: "Faturamento (pago)", value: formatCurrency(revenue), icon: DollarSign },
    { label: "Pedidos", value: ordersCount ?? 0, icon: ShoppingCart },
    { label: "Produtos cadastrados", value: productsCount ?? 0, icon: Package },
    { label: "Estoque baixo", value: lowStock?.length ?? 0, icon: AlertTriangle },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 shadow-card">
            <c.icon size={20} className="mb-2 text-gold-500" />
            <p className="text-2xl font-semibold text-ink">{c.value}</p>
            <p className="text-xs text-brown-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium text-ink">Pedidos recentes</h2>
            <Link href="/admin/pedidos" className="text-xs text-brown-600 underline">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {(recentOrders ?? []).map((o) => (
              <Link key={o.id} href={`/admin/pedidos/${o.id}`} className="flex justify-between rounded-xl px-3 py-2 text-sm hover:bg-cream-100">
                <span>#{o.order_number} — {formatDate(o.created_at)}</span>
                <span className="font-medium">{formatCurrency(o.total)} · {ORDER_STATUS_LABELS[o.status]}</span>
              </Link>
            ))}
            {(recentOrders ?? []).length === 0 && <p className="text-sm text-brown-400">Nenhum pedido ainda.</p>}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium text-ink">Estoque baixo</h2>
            <Link href="/admin/produtos" className="text-xs text-brown-600 underline">Gerenciar produtos</Link>
          </div>
          <div className="space-y-2">
            {(lowStock ?? []).map((p) => (
              <Link key={p.id} href={`/admin/produtos/${p.id}`} className="flex justify-between rounded-xl px-3 py-2 text-sm hover:bg-cream-100">
                <span>{p.name}</span>
                <span className="font-medium text-red-600">{p.stock} un.</span>
              </Link>
            ))}
            {(lowStock ?? []).length === 0 && <p className="text-sm text-brown-400">Nenhum produto com estoque baixo.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
