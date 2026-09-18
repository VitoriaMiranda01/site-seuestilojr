"use client";

import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/lib/supabase/types";

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (banners.length === 0) return null;

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <Link href={banner.link_url ?? "#"} className="relative block aspect-[4/5] w-full sm:aspect-[16/7]">
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  priority
                  className="hidden object-cover sm:block"
                />
                <Image
                  src={banner.mobile_image_url ?? banner.image_url}
                  alt={banner.title}
                  fill
                  priority
                  className="object-cover sm:hidden"
                />
                <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 bg-gradient-to-r from-ink/40 via-transparent to-transparent p-8 sm:p-16">
                  <h2 className="max-w-md font-display text-3xl font-semibold text-white drop-shadow sm:text-5xl">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="max-w-sm text-sm text-white/90 drop-shadow sm:text-base">{banner.subtitle}</p>
                  )}
                  {banner.button_text && <span className="btn-gold">{banner.button_text}</span>}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Banner anterior"
            className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Próximo banner"
            className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft sm:flex"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi?.scrollTo(idx)}
                aria-label={`Ir para banner ${idx + 1}`}
                className={`h-2 w-2 rounded-full ${idx === selected ? "bg-gold-400" : "bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
