import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import KitAddToCart from "@/components/storefront/KitAddToCart";

type Props = { params: Promise<{ slug: string }> };

export default async function KitPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: kit } = await supabase.from("product_kits").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  if (!kit) notFound();

  const { data: kitItems } = await supabase
    .from("product_kit_items")
    .select("quantity, products(id, name, slug, price, product_images(url, sort_order))")
    .eq("kit_id", kit.id);

  return (
    <div className="container-store py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-200">
          {kit.image_url && <Image src={kit.image_url} alt={kit.name} fill className="object-cover" />}
        </div>
        <div className="space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink">{kit.name}</h1>
          <p className="text-sm text-brown-500">{kit.description}</p>
          <p className="font-display text-3xl font-semibold text-brown-700">{formatCurrency(kit.price)}</p>

          {kitItems && kitItems.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Este kit inclui:</p>
              <ul className="space-y-1 text-sm text-brown-500">
                {kitItems.map((ki, idx) => (
                  <li key={idx}>• {ki.quantity}x {ki.products?.name}</li>
                ))}
              </ul>
            </div>
          )}

          <KitAddToCart kit={{ id: kit.id, name: kit.name, price: kit.price, slug: kit.slug, image_url: kit.image_url }} />
        </div>
      </div>
    </div>
  );
}
