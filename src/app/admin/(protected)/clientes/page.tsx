import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { formatDate } from "@/lib/format";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AdminCustomersPage({ searchParams }: Props) {
  await requireAdminRole(["super_admin", "admin", "atendimento"]);
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
  if (q) query = query.ilike("full_name", `%${q}%`);
  const { data: customers } = await query;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Clientes</h1>
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Buscar por nome..." className="w-full max-w-sm rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-left text-xs uppercase text-brown-400">
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Desde</th>
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((c) => (
              <tr key={c.id} className="border-b border-cream-200">
                <td className="p-4"><Link href={`/admin/clientes/${c.id}`} className="font-medium text-ink hover:underline">{c.full_name ?? "—"}</Link></td>
                <td className="p-4 text-brown-400">{c.email}</td>
                <td className="p-4 text-brown-400">{c.phone ?? "—"}</td>
                <td className="p-4 text-brown-400">{formatDate(c.created_at)}</td>
              </tr>
            ))}
            {(customers ?? []).length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-brown-400">Nenhum cliente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
