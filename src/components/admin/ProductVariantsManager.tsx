"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { upsertVariant, deleteVariant } from "@/app/admin/(protected)/produtos/actions";
import type { Tables } from "@/lib/supabase/types";

export default function ProductVariantsManager({
  productId,
  variants,
}: {
  productId: string;
  variants: Tables<"product_variants">[];
}) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await upsertVariant(productId, formData);
        toast.success("Variação salva.");
      } catch {
        toast.error("Erro ao salvar variação.");
      }
    });
  }

  function handleDelete(variantId: string) {
    startTransition(async () => {
      await deleteVariant(variantId, productId);
      toast.success("Variação removida.");
    });
  }

  return (
    <div className="space-y-4 rounded-2xl bg-white p-5 shadow-card">
      <h2 className="font-medium text-ink">Variações</h2>

      {variants.length > 0 && (
        <div className="space-y-2">
          {variants.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-xl bg-cream-100 px-3 py-2 text-sm">
              <span>
                {[v.color, v.size, v.hair_length, v.texture].filter(Boolean).join(" / ") || "Variação"} — Estoque: {v.stock}
                {v.sku && ` — SKU: ${v.sku}`}
              </span>
              <button onClick={() => handleDelete(v.id)} disabled={pending} className="text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form action={handleSubmit} className="grid grid-cols-2 gap-2 border-t border-cream-300 pt-4 sm:grid-cols-3">
        <input name="color" placeholder="Cor" className="rounded-full border border-cream-400 px-3 py-2 text-sm outline-none" />
        <input name="size" placeholder="Tamanho" className="rounded-full border border-cream-400 px-3 py-2 text-sm outline-none" />
        <input name="hair_length" placeholder="Comprimento" className="rounded-full border border-cream-400 px-3 py-2 text-sm outline-none" />
        <input name="texture" placeholder="Textura" className="rounded-full border border-cream-400 px-3 py-2 text-sm outline-none" />
        <input name="sku" placeholder="SKU" className="rounded-full border border-cream-400 px-3 py-2 text-sm outline-none" />
        <input name="stock" type="number" placeholder="Estoque" className="rounded-full border border-cream-400 px-3 py-2 text-sm outline-none" />
        <input name="price_override" type="number" step="0.01" placeholder="Preço (opcional)" className="rounded-full border border-cream-400 px-3 py-2 text-sm outline-none" />
        <button disabled={pending} className="btn-secondary col-span-2 sm:col-span-1">
          <Plus size={14} /> Adicionar variação
        </button>
      </form>
    </div>
  );
}
