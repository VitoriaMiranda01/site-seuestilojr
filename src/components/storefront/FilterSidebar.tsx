import Link from "next/link";
import type { Product } from "@/lib/supabase/types";

function buildFacet(products: Product[], key: "color" | "hair_length" | "texture" | "size") {
  const values = new Set<string>();
  products.forEach((p) => {
    const v = p[key];
    if (v) values.add(v);
  });
  return Array.from(values).sort();
}

export default function FilterSidebar({
  products,
  basePath,
  currentParams,
}: {
  products: Product[];
  basePath: string;
  currentParams: Record<string, string | undefined>;
}) {
  const facets: { key: string; label: string; values: string[] }[] = [
    { key: "cor", label: "Cor", values: buildFacet(products, "color") },
    { key: "comprimento", label: "Comprimento", values: buildFacet(products, "hair_length") },
    { key: "textura", label: "Textura", values: buildFacet(products, "texture") },
    { key: "tamanho", label: "Tamanho", values: buildFacet(products, "size") },
  ].filter((f) => f.values.length > 0);

  function hrefFor(key: string, value: string) {
    const params = new URLSearchParams(
      Object.entries(currentParams).filter(([, v]) => v) as [string, string][],
    );
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  if (facets.length === 0) return null;

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">Filtrar por</p>
      <div className="space-y-5">
        {facets.map((facet) => (
          <div key={facet.key}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brown-400">{facet.label}</p>
            <div className="flex flex-wrap gap-2">
              {facet.values.map((value) => {
                const active = currentParams[facet.key] === value;
                return (
                  <Link
                    key={value}
                    href={hrefFor(facet.key, value)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      active
                        ? "border-brown-600 bg-brown-600 text-white"
                        : "border-cream-400 text-ink hover:border-brown-400"
                    }`}
                  >
                    {value}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
