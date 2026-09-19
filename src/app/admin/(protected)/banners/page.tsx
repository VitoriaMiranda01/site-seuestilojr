import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import BannerActions from "./BannerActions";

export default async function AdminBannersPage() {
  await requireAdminRole(["super_admin", "admin", "editor_marketing"]);
  const supabase = await createClient();
  const { data: banners } = await supabase.from("banners").select("*").order("sort_order");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Banners</h1>
        <Link href="/admin/banners/novo" className="btn-primary"><Plus size={16} /> Novo banner</Link>
      </div>

      <div className="space-y-3">
        {(banners ?? []).map((b) => (
          <div key={b.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card">
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-cream-200">
              <Image src={b.image_url} alt={b.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <Link href={`/admin/banners/${b.id}`} className="font-medium text-ink hover:underline">{b.title}</Link>
              <p className="text-xs text-brown-400">{b.link_url}</p>
            </div>
            <span className="rounded-full bg-cream-200 px-2 py-1 text-xs text-brown-600">
              {b.placement === "collection" ? "Coleções em destaque" : "Banner principal"}
            </span>
            <span className={`rounded-full px-2 py-1 text-xs ${b.active ? "bg-green-100 text-green-700" : "bg-cream-300 text-brown-500"}`}>
              {b.active ? "Ativo" : "Inativo"}
            </span>
            <BannerActions bannerId={b.id} />
          </div>
        ))}
        {(banners ?? []).length === 0 && <p className="text-sm text-brown-400">Nenhum banner cadastrado.</p>}
      </div>
    </div>
  );
}
