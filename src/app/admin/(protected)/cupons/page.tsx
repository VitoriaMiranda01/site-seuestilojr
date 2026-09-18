import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { formatCurrency, formatDate } from "@/lib/format";
import CouponRowActions from "@/components/admin/CouponRowActions";

export default async function AdminCouponsPage() {
  await requireAdminRole(["super_admin", "admin"]);
  const supabase = await createClient();
  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Cupons</h1>
        <Link href="/admin/cupons/novo" className="btn-primary"><Plus size={16} /> Novo cupom</Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-left text-xs uppercase text-brown-400">
              <th className="p-4">Código</th>
              <th className="p-4">Desconto</th>
              <th className="p-4">Pedido mínimo</th>
              <th className="p-4">Uso</th>
              <th className="p-4">Validade</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(coupons ?? []).map((c) => (
              <tr key={c.id} className="border-b border-cream-200">
                <td className="p-4">
                  <Link href={`/admin/cupons/${c.id}`} className="font-medium text-ink hover:underline">{c.code}</Link>
                </td>
                <td className="p-4 text-brown-500">
                  {c.type === "percent" ? `${c.value}%` : formatCurrency(c.value)}
                </td>
                <td className="p-4 text-brown-400">{c.min_order_value > 0 ? formatCurrency(c.min_order_value) : "—"}</td>
                <td className="p-4 text-brown-400">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}</td>
                <td className="p-4 text-brown-400">{c.expires_at ? formatDate(c.expires_at) : "Sem prazo"}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs ${c.active ? "bg-green-100 text-green-700" : "bg-cream-300 text-brown-500"}`}>
                    {c.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4"><CouponRowActions couponId={c.id} active={c.active} /></td>
              </tr>
            ))}
            {(coupons ?? []).length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-brown-400">Nenhum cupom cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
