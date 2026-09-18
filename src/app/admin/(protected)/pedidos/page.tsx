import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";
import type { Enums } from "@/lib/supabase/types";

type Props = { searchParams: Promise<{ status?: string }> };

const STATUSES: Enums<"order_status">[] = ["pending", "paid", "processing", "shipped", "delivered", "canceled", "refunded"];

export default async function AdminOrdersPage({ searchParams }: Props) {
  await requireAdminRole(["super_admin", "admin", "atendimento"]);
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("id, order_number, status, payment_status, total, guest_name, guest_email, profile_id, created_at, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  const validStatus = STATUSES.find((s) => s === status);
  if (validStatus) query = query.eq("status", validStatus);

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Pedidos</h1>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        <Link href="/admin/pedidos" className={`shrink-0 rounded-full px-3 py-1 text-xs ${!status ? "bg-brown-600 text-white" : "bg-white text-brown-500"}`}>
          Todos
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/pedidos?status=${s}`} className={`shrink-0 rounded-full px-3 py-1 text-xs ${status === s ? "bg-brown-600 text-white" : "bg-white text-brown-500"}`}>
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-left text-xs uppercase text-brown-400">
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="border-b border-cream-200">
                <td className="p-4">
                  <Link href={`/admin/pedidos/${o.id}`} className="font-medium text-ink hover:underline">#{o.order_number}</Link>
                </td>
                <td className="p-4 text-brown-500">{o.profiles?.full_name ?? o.guest_name ?? "—"}</td>
                <td className="p-4 text-brown-400">{formatDate(o.created_at)}</td>
                <td className="p-4">{formatCurrency(o.total)}</td>
                <td className="p-4">
                  <span className="rounded-full bg-cream-200 px-2 py-1 text-xs text-brown-600">{ORDER_STATUS_LABELS[o.status]}</span>
                </td>
              </tr>
            ))}
            {(orders ?? []).length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-brown-400">Nenhum pedido encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
