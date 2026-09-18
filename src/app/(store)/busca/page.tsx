import { searchProducts } from "@/lib/queries";
import ProductCard from "@/components/storefront/ProductCard";
import SortAndFilters from "@/components/storefront/SortAndFilters";
import FilterSidebar from "@/components/storefront/FilterSidebar";

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export const metadata = { title: "Busca" };

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;

  const products = await searchProducts({
    q: sp.q,
    sort: sp.sort,
    offers: sp.ofertas === "1",
    featured: sp.destaque === "1",
    isNew: sp.novidades === "1",
    bestseller: sp["mais-vendidos"] === "1",
  });

  const title = sp.q
    ? `Resultados para "${sp.q}"`
    : sp.ofertas === "1"
      ? "Ofertas Especiais"
      : sp.novidades === "1"
        ? "Lançamentos"
        : sp["mais-vendidos"] === "1"
          ? "Mais Vendidos"
          : sp.destaque === "1"
            ? "Produtos em Destaque"
            : "Todos os produtos";

  return (
    <div className="container-store py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">{title}</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar products={products} basePath="/busca" currentParams={sp} />
        <div className="flex-1">
          <SortAndFilters resultCount={products.length} />
          {products.length === 0 ? (
            <p className="py-16 text-center text-sm text-brown-400">
              Nenhum produto encontrado. Tente outra busca.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
