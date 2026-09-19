"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { Banner } from "@/lib/supabase/types";

export default function BannerForm({
  action,
  banner,
}: {
  action: (formData: FormData) => Promise<void>;
  banner?: Banner;
}) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar banner.");
      }
    });
  }

  function toInputDate(value: string | null | undefined) {
    if (!value) return "";
    return new Date(value).toISOString().slice(0, 16);
  }

  return (
    <form action={handleSubmit} className="max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-card">
      <label className="block text-sm">
        Título *
        <input required name="title" defaultValue={banner?.title ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Subtítulo
        <input name="subtitle" defaultValue={banner?.subtitle ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Imagem desktop (URL) *
        <input required name="image_url" defaultValue={banner?.image_url ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Imagem mobile (URL)
        <input name="mobile_image_url" defaultValue={banner?.mobile_image_url ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Texto do botão
        <input name="button_text" defaultValue={banner?.button_text ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Link do botão
        <input name="link_url" defaultValue={banner?.link_url ?? ""} placeholder="/categoria/laces" className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Onde exibir
        <select name="placement" defaultValue={banner?.placement ?? "hero"} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none">
          <option value="hero">Banner principal (rotativo, topo da Home)</option>
          <option value="collection">Coleções em destaque (dois banners lado a lado)</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          Início
          <input type="datetime-local" name="starts_at" defaultValue={toInputDate(banner?.starts_at)} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          Fim
          <input type="datetime-local" name="ends_at" defaultValue={toInputDate(banner?.ends_at)} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={banner?.active ?? true} /> Ativo</label>
      <button disabled={pending} className="btn-primary">{pending ? "Salvando..." : "Salvar banner"}</button>
    </form>
  );
}
