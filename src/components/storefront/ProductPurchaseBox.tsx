"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, discountPercent } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/supabase/types";

export default function ProductPurchaseBox({
  product,
  whatsappNumber,
}: {
  product: Product;
  whatsappNumber: string;
}) {
  const variants = product.product_variants ?? [];
  const [variantId, setVariantId] = useState<string | null>(variants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const selectedVariant = variants.find((v) => v.id === variantId) ?? null;
  const price = selectedVariant?.price_override ?? product.sale_price ?? product.price;
  const originalPrice = product.sale_price ? product.price : null;
  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const discount = discountPercent(product.price, product.sale_price);

  const image = product.product_images?.[0]?.url ?? null;

  const variantLabel = useMemo(() => {
    if (!selectedVariant) return null;
    return [selectedVariant.color, selectedVariant.size, selectedVariant.hair_length, selectedVariant.texture]
      .filter(Boolean)
      .join(" / ");
  }, [selectedVariant]);

  function handleAddToCart(goToCheckout = false) {
    if (stock <= 0) {
      toast.error("Produto sem estoque no momento.");
      return;
    }
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        name: product.name,
        variantLabel,
        unitPrice: price,
        imageUrl: image,
        slug: product.slug,
        stock,
      },
      quantity,
    );
    toast.success("Produto adicionado ao carrinho.");
    if (goToCheckout) router.push("/carrinho");
  }

  return (
    <div className="space-y-5">
      <div>
        {product.brand && <p className="text-xs uppercase tracking-wide text-brown-300">{product.brand}</p>}
        <h1 className="font-display text-2xl font-semibold text-ink lg:text-3xl">{product.name}</h1>
        {product.avg_rating > 0 && (
          <p className="mt-1 text-sm text-brown-400">
            ★ {product.avg_rating.toFixed(1)} ({product.reviews_count} avaliações)
          </p>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-semibold text-brown-700">{formatCurrency(price)}</span>
        {originalPrice && (
          <>
            <span className="text-base text-brown-300 line-through">{formatCurrency(originalPrice)}</span>
            <span className="rounded-full bg-brown-600 px-2 py-1 text-xs font-semibold text-white">
              -{discount}%
            </span>
          </>
        )}
      </div>
      <p className="text-xs text-brown-400">ou em até 12x no cartão</p>

      {variants.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Variações</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const label = [v.color, v.size, v.hair_length, v.texture].filter(Boolean).join(" / ") || "Padrão";
              return (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  disabled={v.stock <= 0}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    variantId === v.id ? "border-brown-600 bg-brown-600 text-white" : "border-cream-400 text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-sm">
        {stock > 0 ? (
          <span className="text-green-700">Em estoque{stock <= 5 ? ` — últimas ${stock} unidades` : ""}</span>
        ) : (
          <span className="text-red-600">Produto esgotado</span>
        )}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-cream-400">
          <button
            className="p-3"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            className="p-3"
            onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
            aria-label="Aumentar quantidade"
          >
            <Plus size={16} />
          </button>
        </div>
        <button onClick={() => handleAddToCart(true)} disabled={stock <= 0} className="btn-primary flex-1">
          <ShoppingBag size={18} /> Comprar
        </button>
      </div>
      <button onClick={() => handleAddToCart(false)} disabled={stock <= 0} className="btn-secondary w-full">
        Adicionar ao carrinho
      </button>

      <a
        href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
          `Olá! Tenho uma dúvida sobre o produto: ${product.name}`,
        )}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 text-sm font-medium text-brown-600 hover:underline"
      >
        <MessageCircle size={16} /> Tirar dúvida no WhatsApp
      </a>
    </div>
  );
}
