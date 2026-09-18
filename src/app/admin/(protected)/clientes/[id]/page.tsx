import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCustomerDetailPage({ params }: Props) {
  await requireAdminRole(["super_admin", "admin", "atendimento"]);
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!customer) notFound();

  const [{ data: addresses }, { data: orders }] = await Promise.all([
    supabase.from("addresses").select("*").eq("profile_id", id).order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("id, order_number, status, payment_status, total, created_at")
      .eq("profile_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const totalGasto = (orders ?? [])
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-4xl">
      <Link href="/admin/clientes" className="mb-4 inline-block text-sm text-brown-400 hover:underline">
        ← Voltar para clientes
      </Link>
      <h1 className="mb-1 font-display text-3xl font-semibold text-ink">{customer.full_name ?? "Cliente"}</h1>
      <p className="mb-6 text-sm text-brown-400">Cliente desde {formatDate(customer.created_at)}</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h2 className="mb-3 font-medium text-ink">Histórico de pedidos</h2>
            <div className="space-y-2">
              {(orders ?? []).map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/pedidos/${o.id}`}
                  className="flex items-center justify-between rounded-xl border border-cream-200 p-3 text-sm hover:bg-cream-100"
                >
                  <div>
                    <p className="font-medium text-ink">#{o.order_number}</p>
                    <p className="text-xs text-brown-400">{formatDate(o.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-ink">{formatCurrency(o.total)}</p>
                    <span className="rounded-full bg-cream-200 px-2 py-0.5 text-xs text-brown-600">
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                  </div>
                </Link>
              ))}
              {(orders ?? []).length === 0 && (
                <p className="p-4 text-center text-sm text-brown-400">Nenhum pedido ainda.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h2 className="mb-3 font-medium text-ink">Endereços</h2>
            <div className="space-y-3">
              {(addresses ?? []).map((a) => (
                <div key={a.id} className="rounded-xl border border-cream-200 p-3 text-sm text-brown-500">
                  <p className="font-medium text-ink">{a.recipient_name}</p>
                  <p>
                    {a.street}, {a.number} {a.complement && `- ${a.complement}`}
                  </p>
                  <p>
                    {a.neighborhood}, {a.city}/{a.state} — {a.zip_code}
                  </p>
                </div>
              ))}
              {(addresses ?? []).length === 0 && (
                <p className="p-4 text-center text-sm text-brown-400">Nenhum endereço cadastrado.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-5 shadow-card text-sm">
            <p className="mb-2 font-medium text-ink">Contato</p>
            <p className="text-brown-500">{customer.email}</p>
            <p className="text-brown-500">{customer.phone ?? "—"}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card text-sm">
            <p className="mb-2 font-medium text-ink">Resumo</p>
            <div className="flex justify-between text-brown-500">
              <span>Pedidos</span>
              <span>{(orders ?? []).length}</span>
            </div>
            <div className="flex justify-between text-brown-500">
              <span>Total gasto (pago)</span>
              <span>{formatCurrency(totalGasto)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
