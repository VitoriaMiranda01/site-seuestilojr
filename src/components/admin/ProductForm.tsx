"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { Category, Product } from "@/lib/supabase/types";

export default function ProductForm({
  action,
  categories,
  product,
  stockOnly = false,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  product?: Product;
  stockOnly?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Salvo com sucesso.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
      }
    });
  }

  if (stockOnly) {
    return (
      <form action={handleSubmit} className="max-w-sm space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <label className="block text-sm">
          SKU
          <input name="sku" defaultValue={product?.sku ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          Estoque
          <input name="stock" type="number" defaultValue={product?.stock ?? 0} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <button disabled={pending} className="btn-primary">{pending ? "Salvando..." : "Salvar estoque"}</button>
      </form>
    );
  }

  return (
    <form action={handleSubmit} className="grid max-w-4xl gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-medium text-ink">Informações básicas</h2>
        <label className="block text-sm">
          Nome *
          <input required name="name" defaultValue={product?.name ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          Slug (URL)
          <input name="slug" defaultValue={product?.slug ?? ""} placeholder="gerado automaticamente se vazio" className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          Descrição curta
          <input name="short_description" defaultValue={product?.short_description ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          Descrição completa
          <textarea name="description" defaultValue={product?.description ?? ""} rows={4} className="mt-1 w-full rounded-2xl border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          Categoria
          <select name="category_id" defaultValue={product?.category_id ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none">
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Marca
          <input name="brand" defaultValue={product?.brand ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          SKU
          <input name="sku" defaultValue={product?.sku ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-medium text-ink">Preço e estoque</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Preço *
            <input required name="price" type="number" step="0.01" defaultValue={product?.price ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
          <label className="block text-sm">
            Preço promocional
            <input name="sale_price" type="number" step="0.01" defaultValue={product?.sale_price ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
        </div>
        <label className="block text-sm">
          Estoque
          <input name="stock" type="number" defaultValue={product?.stock ?? 0} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>

        <h2 className="pt-2 font-medium text-ink">Atributos</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Cor
            <input name="color" defaultValue={product?.color ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
          <label className="block text-sm">
            Tamanho
            <input name="size" defaultValue={product?.size ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
          <label className="block text-sm">
            Comprimento
            <input name="hair_length" defaultValue={product?.hair_length ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
          <label className="block text-sm">
            Textura
            <input name="texture" defaultValue={product?.texture ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
          <label className="block text-sm">
            Peso (g)
            <input name="weight_grams" type="number" step="0.01" defaultValue={product?.weight_grams ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
        </div>

        <h2 className="pt-2 font-medium text-ink">Visibilidade</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Ativo na loja</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} /> Destaque</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_new" defaultChecked={product?.is_new ?? false} /> Lançamento</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_bestseller" defaultChecked={product?.is_bestseller ?? false} /> Mais vendido</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_offer" defaultChecked={product?.is_offer ?? false} /> Oferta</label>
        </div>

        <button disabled={pending} className="btn-primary mt-2">{pending ? "Salvando..." : "Salvar produto"}</button>
      </div>
    </form>
  );
}
