"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { deleteBanner, reorderBanner } from "./actions";

export default function BannerActions({ bannerId }: { bannerId: string }) {
  const [pending, startTransition] = useTransition();

  function remove() {
    if (!confirm("Excluir este banner?")) return;
    startTransition(async () => {
      await deleteBanner(bannerId);
      toast.success("Banner excluído.");
    });
  }

  return (
    <div className="flex gap-2">
      <button disabled={pending} onClick={() => startTransition(() => reorderBanner(bannerId, "up"))} className="text-brown-500"><ArrowUp size={16} /></button>
      <button disabled={pending} onClick={() => startTransition(() => reorderBanner(bannerId, "down"))} className="text-brown-500"><ArrowDown size={16} /></button>
      <button disabled={pending} onClick={remove} className="text-red-500"><Trash2 size={16} /></button>
    </div>
  );
}
