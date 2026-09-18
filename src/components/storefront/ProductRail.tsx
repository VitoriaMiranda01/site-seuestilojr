"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/supabase/types";
import ProductCard from "./ProductCard";

export default function ProductRail({
  title,
  subtitle,
  products,
  seeAllHref,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  seeAllHref?: string;
}) {
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

  if (products.length === 0) return null;

  return (
    <section className="container-store py-10 lg:py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink lg:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-brown-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {seeAllHref && (
            <Link href={seeAllHref} className="hidden text-sm font-medium text-brown-600 hover:underline sm:block">
              Ver todos
            </Link>
          )}
          <div className="hidden gap-2 lg:flex">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-400 disabled:opacity-30"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-400 disabled:opacity-30"
              aria-label="Próximo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {products.map((p) => (
            <div key={p.id} className="w-[45%] shrink-0 sm:w-[30%] lg:w-[22%]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {seeAllHref && (
        <Link href={seeAllHref} className="mt-4 block text-center text-sm font-medium text-brown-600 sm:hidden">
          Ver todos
        </Link>
      )}
    </section>
  );
}
