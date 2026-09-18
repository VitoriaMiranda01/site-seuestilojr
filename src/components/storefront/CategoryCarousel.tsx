"use client";

import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import type { Category } from "@/lib/supabase/types";

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
  }, [emblaApi, update]);

  if (categories.length === 0) return null;

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-28"
            >
              <span
                className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 sm:h-24 sm:w-24 ${
                  cat.highlight ? "border-gold-400" : "border-cream-400"
                }`}
              >
                {cat.image_url ? (
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                ) : (
                  <span className="bg-cream-200 font-display text-lg text-brown-500">
                    {cat.name.charAt(0)}
                  </span>
                )}
              </span>
              <span className="text-xs font-medium text-ink line-clamp-2">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <button
        aria-label="Categorias anteriores"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className="absolute -left-3 top-1/3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-soft disabled:opacity-0 lg:flex"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        aria-label="Próximas categorias"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className="absolute -right-3 top-1/3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-soft disabled:opacity-0 lg:flex"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
