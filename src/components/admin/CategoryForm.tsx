"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { Category } from "@/lib/supabase/types";

export default function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => Promise<void>;
  category?: Category;
}) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar categoria.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-card">
      <label className="block text-sm">
        Nome *
        <input required name="name" defaultValue={category?.name ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Slug (URL)
        <input name="slug" defaultValue={category?.slug ?? ""} placeholder="gerado automaticamente se vazio" className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Descrição
        <textarea name="description" defaultValue={category?.description ?? ""} rows={3} className="mt-1 w-full rounded-2xl border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Imagem (URL)
        <input name="image_url" defaultValue={category?.image_url ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Grupo
        <select name="group_name" defaultValue={category?.group_name ?? "wigs_e_cabelos"} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none">
          <option value="wigs_e_cabelos">Wigs e Cabelos</option>
          <option value="acessorios">Acessórios para Wigs</option>
          <option value="cuidados">Cuidados</option>
        </select>
      </label>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={category?.active ?? true} /> Ativa</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="highlight" defaultChecked={category?.highlight ?? false} /> Destaque</label>
      </div>
      <button disabled={pending} className="btn-primary">{pending ? "Salvando..." : "Salvar categoria"}</button>
    </form>
  );
}
