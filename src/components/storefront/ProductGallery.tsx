"use client";

import Image from "next/image";
import { useState } from "react";
import type { Tables } from "@/lib/supabase/types";

export default function ProductGallery({ images, name }: { images: Tables<"product_images">[]; name: string }) {
  const [active, setActive] = useState(0);
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const current = sorted[active] ?? sorted[0];

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-visible">
        {sorted.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setActive(idx)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
              idx === active ? "border-brown-600" : "border-cream-400"
            }`}
          >
            <Image src={img.url} alt={img.alt ?? name} fill className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-square flex-1 overflow-hidden rounded-2xl bg-cream-200 sm:order-2">
        {current ? (
          <Image src={current.url} alt={current.alt ?? name} fill priority className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-brown-300">Sem imagem</div>
        )}
      </div>
    </div>
  );
}
