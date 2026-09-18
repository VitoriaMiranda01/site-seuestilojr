import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import CategoryRowActions from "@/components/admin/CategoryRowActions";

const GROUP_LABELS: Record<string, string> = {
  wigs_e_cabelos: "Wigs e Cabelos",
  acessorios: "Acessórios",
  cuidados: "Cuidados",
};

export default async function AdminCategoriesPage() {
  await requireAdminRole(["super_admin", "admin", "editor_marketing"]);
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Categorias</h1>
        <Link href="/admin/categorias/nova" className="btn-primary"><Plus size={16} /> Nova categoria</Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-left text-xs uppercase text-brown-400">
              <th className="p-4">Nome</th>
              <th className="p-4">Grupo</th>
              <th className="p-4">Destaque</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((c) => (
              <tr key={c.id} className="border-b border-cream-200">
                <td className="p-4">
                  <Link href={`/admin/categorias/${c.id}`} className="font-medium text-ink hover:underline">{c.name}</Link>
                </td>
                <td className="p-4 text-brown-400">{GROUP_LABELS[c.group_name]}</td>
                <td className="p-4">{c.highlight ? "Sim" : "—"}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs ${c.active ? "bg-green-100 text-green-700" : "bg-cream-300 text-brown-500"}`}>
                    {c.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4"><CategoryRowActions categoryId={c.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
