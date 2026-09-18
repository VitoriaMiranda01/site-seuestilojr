import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { Tables } from "@/lib/supabase/types";

export default function KitsSection({ kits }: { kits: Tables<"product_kits">[] }) {
  if (kits.length === 0) return null;
  return (
    <section className="container-store py-10 lg:py-14">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-ink lg:text-3xl">Kits e Combinações</h2>
        <p className="mt-1 text-sm text-brown-400">Economize combinando produtos essenciais</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kits.map((kit) => (
          <Link key={kit.id} href={`/kits/${kit.slug}`} className="group flex flex-col">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-200">
              {kit.image_url && (
                <Image src={kit.image_url} alt={kit.name} fill className="object-cover transition-transform group-hover:scale-105" />
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm font-medium text-ink">{kit.name}</p>
            <p className="font-display text-sm font-semibold text-brown-700">{formatCurrency(kit.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
