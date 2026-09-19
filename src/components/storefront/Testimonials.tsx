"use client";

import { Star, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Tables } from "@/lib/supabase/types";

export default function Testimonials({ reviews }: { reviews: Tables<"reviews">[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start", dragFree: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-10 lg:py-14">
      <div className="container-store">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink lg:text-3xl">Quem usa, ama e recomenda</h2>
          <p className="mt-1 text-sm text-brown-400">Junte-se às nossas clientes apaixonadas</p>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-cream-300 bg-white p-5 shadow-soft sm:w-80"
              >
                <Quote className="text-gold-400" size={22} />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "fill-gold-400 text-gold-400" : "text-brown-300"}
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="line-clamp-5 text-sm text-brown-500">{review.comment}</p>
                )}
                <p className="mt-auto text-sm font-semibold text-ink">{review.customer_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
