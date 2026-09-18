import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import ProductCard from "@/components/storefront/ProductCard";
import SortAndFilters from "@/components/storefront/SortAndFilters";
import FilterSidebar from "@/components/storefront/FilterSidebar";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Categoria" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id, {
    sort: sp.sort,
    color: sp.cor,
    length: sp.comprimento,
    texture: sp.textura,
    size: sp.tamanho,
  });

  return (
    <div className="container-store py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-brown-400">
          {category.group_name === "wigs_e_cabelos"
            ? "Wigs e Cabelos"
            : category.group_name === "acessorios"
              ? "Acessórios para Wigs"
              : "Cuidados"}
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink">{category.name}</h1>
        {category.description && <p className="mt-2 max-w-2xl text-sm text-brown-400">{category.description}</p>}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar products={products} basePath={`/categoria/${slug}`} currentParams={sp} />
        <div className="flex-1">
          <SortAndFilters resultCount={products.length} />
          {products.length === 0 ? (
            <p className="py-16 text-center text-sm text-brown-400">
              Nenhum produto encontrado nesta categoria por enquanto.
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
