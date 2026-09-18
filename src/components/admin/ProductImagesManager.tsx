"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addProductImage, removeProductImage } from "@/app/admin/(protected)/produtos/actions";
import type { Tables } from "@/lib/supabase/types";

export default function ProductImagesManager({
  productId,
  images,
}: {
  productId: string;
  images: Tables<"product_images">[];
}) {
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${productId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);
      await addProductImage(productId, publicUrl.publicUrl, sorted.length);
      toast.success("Imagem adicionada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar imagem.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleRemove(imageId: string) {
    startTransition(async () => {
      await removeProductImage(imageId, productId);
      toast.success("Imagem removida.");
    });
  }

  return (
    <div className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
      <h2 className="font-medium text-ink">Imagens do produto</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {sorted.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-cream-200">
            <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" />
            <button
              disabled={pending}
              onClick={() => handleRemove(img.id)}
              className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        ))}
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-cream-400 text-brown-400 hover:border-brown-400">
          <Upload size={20} />
          <span className="text-xs">{uploading ? "Enviando..." : "Adicionar"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}
