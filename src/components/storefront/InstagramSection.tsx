import { Instagram } from "lucide-react";

export default function InstagramSection({ instagramUrl }: { instagramUrl: string }) {
  const tiles = Array.from({ length: 6 });
  return (
    <section className="container-store py-10 lg:py-14">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink lg:text-3xl">Siga no Instagram</h2>
          <p className="mt-1 text-sm text-brown-400">Inspirações, novidades e bastidores</p>
        </div>
        <a href={instagramUrl} target="_blank" rel="noreferrer" className="btn-secondary">
          <Instagram size={16} /> Seguir
        </a>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {tiles.map((_, i) => (
          <a
            key={i}
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="relative aspect-square overflow-hidden rounded-xl bg-cream-300"
          >
            <div className="flex h-full items-center justify-center text-brown-300">
              <Instagram size={24} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
