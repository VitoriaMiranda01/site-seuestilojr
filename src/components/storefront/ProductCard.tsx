import Link from "next/link";
import Image from "next/image";
import { formatCurrency, discountPercent } from "@/lib/format";
import type { Product } from "@/lib/supabase/types";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.product_images?.[0]?.url;
  const discount = discountPercent(product.price, product.sale_price);
  const finalPrice = product.sale_price ?? product.price;

  return (
    <Link href={`/produto/${product.slug}`} className="group flex w-full flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream-200">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, 280px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brown-300">Sem imagem</div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.is_new && (
            <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-brown-700">
              Novo
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-brown-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} />
        </div>

        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">Esgotado</span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {product.brand && <p className="text-[11px] uppercase tracking-wide text-brown-300">{product.brand}</p>}
        <h3 className="line-clamp-2 text-sm font-medium text-ink">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base font-semibold text-brown-700">{formatCurrency(finalPrice)}</span>
          {product.sale_price && (
            <span className="text-xs text-brown-300 line-through">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
