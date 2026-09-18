import type { Product } from "@/lib/supabase/types";

export default function ProductDetails({ product }: { product: Product }) {
  const specs: [string, string | null | undefined][] = (
    [
      ["SKU", product.sku],
      ["Marca", product.brand],
      ["Cor", product.color],
      ["Tamanho", product.size],
      ["Comprimento", product.hair_length],
      ["Textura", product.texture],
      ["Peso", product.weight_grams ? `${product.weight_grams}g` : null],
    ] satisfies [string, string | null | undefined][]
  ).filter(([, v]) => v);

  return (
    <div className="grid gap-8 py-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Descrição</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-brown-500">
          {product.description || product.short_description || "Sem descrição disponível."}
        </p>
      </div>
      <div>
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Especificações</h2>
        <dl className="space-y-2 text-sm">
          {specs.map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-cream-300 py-2">
              <dt className="text-brown-400">{label}</dt>
              <dd className="font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
