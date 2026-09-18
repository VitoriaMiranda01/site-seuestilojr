import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, requireAdminRole, ROLE_LABELS } from "@/lib/admin-auth";
import { formatDate } from "@/lib/format";
import AdminRowActions from "@/components/admin/AdminRowActions";

export default async function AdminUsersPage() {
  await requireAdminRole(["super_admin"]);
  const me = await getAdminSession();
  const supabase = await createClient();
  const { data: admins } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Administradores</h1>
          <p className="text-sm text-brown-400">Gerencie quem tem acesso ao painel e com qual permissão.</p>
        </div>
        <Link href="/admin/admins/novo" className="btn-primary"><Plus size={16} /> Novo administrador</Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-left text-xs uppercase text-brown-400">
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Desde</th>
              <th className="p-4">Status</th>
              <th className="p-4">Permissão</th>
            </tr>
          </thead>
          <tbody>
            {(admins ?? []).map((a) => (
              <tr key={a.id} className="border-b border-cream-200">
                <td className="p-4 font-medium text-ink">{a.full_name}</td>
                <td className="p-4 text-brown-400">{a.email}</td>
                <td className="p-4 text-brown-400">{formatDate(a.created_at)}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs ${a.active ? "bg-green-100 text-green-700" : "bg-cream-300 text-brown-500"}`}>
                    {a.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4">
                  <AdminRowActions adminUserId={a.id} role={a.role} active={a.active} isSelf={a.id === me?.id} />
                  {a.id === me?.id && (
                    <span className="ml-2 text-xs text-brown-400">({ROLE_LABELS[a.role]})</span>
                  )}
                </td>
              </tr>
            ))}
            {(admins ?? []).length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-brown-400">Nenhum administrador cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
