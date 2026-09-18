import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, requireAdminRole } from "@/lib/admin-auth";
import { formatCurrency } from "@/lib/format";
import ProductRowActions from "./ProductRowActions";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireAdminRole(["super_admin", "admin", "estoque", "editor_marketing"]);
  const { q } = await searchParams;
  const admin = await getAdminSession();
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("id, name, sku, price, sale_price, stock, active, is_featured, categories(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (q) query = query.ilike("name", `%${q}%`);

  const { data: products } = await query;
  const canManageFull = admin?.role === "super_admin" || admin?.role === "admin";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Produtos</h1>
        {canManageFull && (
          <Link href="/admin/produtos/novo" className="btn-primary">
            <Plus size={16} /> Novo produto
          </Link>
        )}
      </div>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome..."
          className="w-full max-w-sm rounded-full border border-cream-400 px-4 py-2 text-sm outline-none"
        />
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-left text-xs uppercase text-brown-400">
              <th className="p-4">Produto</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id} className="border-b border-cream-200">
                <td className="p-4">
                  <Link href={`/admin/produtos/${p.id}`} className="font-medium text-ink hover:underline">
                    {p.name}
                  </Link>
                  {p.is_featured && <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] text-gold-600">Destaque</span>}
                </td>
                <td className="p-4 text-brown-400">{p.categories?.name ?? "—"}</td>
                <td className="p-4 text-brown-400">{p.sku ?? "—"}</td>
                <td className="p-4">
                  {formatCurrency(p.sale_price ?? p.price)}
                  {p.sale_price && <span className="ml-1 text-xs text-brown-300 line-through">{formatCurrency(p.price)}</span>}
                </td>
                <td className={`p-4 ${p.stock <= 5 ? "text-red-600" : ""}`}>{p.stock}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs ${p.active ? "bg-green-100 text-green-700" : "bg-cream-300 text-brown-500"}`}>
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4">
                  <ProductRowActions productId={p.id} active={p.active} canManageFull={canManageFull} />
                </td>
              </tr>
            ))}
            {(products ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-brown-400">Nenhum produto encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
