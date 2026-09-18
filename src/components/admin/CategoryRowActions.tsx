"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { deleteCategory, reorderCategory } from "@/app/admin/(protected)/categorias/actions";

export default function CategoryRowActions({ categoryId }: { categoryId: string }) {
  const [pending, startTransition] = useTransition();

  function move(direction: "up" | "down") {
    startTransition(() => reorderCategory(categoryId, direction));
  }

  function remove() {
    if (!confirm("Excluir esta categoria?")) return;
    startTransition(async () => {
      try {
        await deleteCategory(categoryId);
        toast.success("Categoria excluída.");
      } catch {
        toast.error("Não foi possível excluir. Verifique se há produtos vinculados.");
      }
    });
  }

  return (
    <div className="flex gap-2">
      <button disabled={pending} onClick={() => move("up")} className="text-brown-500 hover:text-brown-700"><ArrowUp size={14} /></button>
      <button disabled={pending} onClick={() => move("down")} className="text-brown-500 hover:text-brown-700"><ArrowDown size={14} /></button>
      <button disabled={pending} onClick={remove} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
    </div>
  );
}
