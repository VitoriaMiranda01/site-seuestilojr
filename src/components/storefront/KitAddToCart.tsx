"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";

export default function KitAddToCart({
  kit,
}: {
  kit: { id: string; name: string; price: number; slug: string; image_url: string | null };
}) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    addItem({
      productId: kit.id,
      variantId: null,
      name: `${kit.name} (Kit)`,
      variantLabel: null,
      unitPrice: kit.price,
      imageUrl: kit.image_url,
      slug: kit.slug,
      stock: 99,
      isKit: true,
    });
    toast.success("Kit adicionado ao carrinho.");
  }

  return (
    <button onClick={handleAdd} className="btn-primary">
      <ShoppingBag size={18} /> Adicionar kit ao carrinho
    </button>
  );
}
