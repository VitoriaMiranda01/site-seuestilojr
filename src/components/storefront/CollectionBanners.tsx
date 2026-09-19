import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/supabase/types";

export default function CollectionBanners({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;

  return (
    <section className="container-store py-10 lg:py-14">
      <div className={`grid gap-4 sm:gap-6 ${banners.length === 1 ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        {banners.slice(0, 2).map((banner) => (
          <Link
            key={banner.id}
            href={banner.link_url ?? "#"}
            className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream-200 sm:aspect-[3/4]"
          >
            <Image
              src={banner.image_url}
              alt={banner.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 top-0 p-6 sm:p-8">
              {banner.subtitle && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{banner.subtitle}</p>
              )}
              <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-wide text-white sm:text-3xl">
                {banner.title}
              </h3>
            </div>
            {banner.button_text && (
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="inline-block rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-ink transition-colors group-hover:bg-gold-400 group-hover:text-white">
                  {banner.button_text}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
