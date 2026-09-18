import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { formatDate } from "@/lib/format";

type Props = { searchParams: Promise<{ tipo?: string; q?: string }> };

const RESOURCE_LABELS: Record<string, string> = {
  product: "Produto",
  category: "Categoria",
  banner: "Banner",
  promo_message: "Barra promocional",
  order: "Pedido",
  coupon: "Cupom",
  admin_user: "Administrador",
};

const RESOURCE_TYPES = ["product", "category", "banner", "promo_message", "order", "coupon", "admin_user"];

export default async function AdminAuditLogPage({ searchParams }: Props) {
  await requireAdminRole(["super_admin", "admin"]);
  const { tipo, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (tipo) query = query.eq("resource_type", tipo);
  if (q) query = query.ilike("admin_email", `%${q}%`);

  const { data: logs } = await query;

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-semibold text-ink">Auditoria</h1>
      <p className="mb-6 text-sm text-brown-400">Histórico de ações realizadas por administradores no painel.</p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <form className="flex-shrink-0">
          <input
            type="hidden"
            name="tipo"
            value={tipo ?? ""}
          />
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por e-mail do admin..."
            className="w-64 rounded-full border border-cream-400 px-4 py-2 text-sm outline-none"
          />
        </form>
        <div className="flex flex-wrap gap-2">
          <Link href={q ? `/admin/auditoria?q=${q}` : "/admin/auditoria"} className={`rounded-full px-3 py-1 text-xs ${!tipo ? "bg-brown-600 text-white" : "bg-white text-brown-500"}`}>
            Todos
          </Link>
          {RESOURCE_TYPES.map((t) => (
            <Link
              key={t}
              href={`/admin/auditoria?tipo=${t}${q ? `&q=${q}` : ""}`}
              className={`rounded-full px-3 py-1 text-xs ${tipo === t ? "bg-brown-600 text-white" : "bg-white text-brown-500"}`}
            >
              {RESOURCE_LABELS[t]}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-left text-xs uppercase text-brown-400">
              <th className="p-4">Data</th>
              <th className="p-4">Admin</th>
              <th className="p-4">Ação</th>
              <th className="p-4">Recurso</th>
              <th className="p-4">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {(logs ?? []).map((l) => (
              <tr key={l.id} className="border-b border-cream-200 align-top">
                <td className="whitespace-nowrap p-4 text-brown-400">{formatDate(l.created_at)}</td>
                <td className="p-4 text-brown-600">{l.admin_email ?? "—"}</td>
                <td className="p-4 font-medium text-ink">{l.action}</td>
                <td className="p-4 text-brown-500">
                  {RESOURCE_LABELS[l.resource_type] ?? l.resource_type}
                  {l.resource_id && <span className="ml-1 text-xs text-brown-300">#{l.resource_id.slice(0, 8)}</span>}
                </td>
                <td className="max-w-xs p-4 text-xs text-brown-400">
                  {l.details ? JSON.stringify(l.details) : "—"}
                </td>
              </tr>
            ))}
            {(logs ?? []).length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-brown-400">Nenhum registro encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
