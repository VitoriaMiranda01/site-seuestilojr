"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { toggleProductActive, deleteProduct, duplicateProduct } from "./actions";

export default function ProductRowActions({
  productId,
  active,
  canManageFull,
}: {
  productId: string;
  active: boolean;
  canManageFull: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleProductActive(productId, !active);
        toast.success(active ? "Produto desativado." : "Produto ativado.");
      } catch {
        toast.error("Não foi possível atualizar o produto.");
      }
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      try {
        await duplicateProduct(productId);
      } catch {
        toast.error("Não foi possível duplicar o produto.");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast.success("Produto excluído.");
      } catch {
        toast.error("Não foi possível excluir o produto.");
      }
    });
  }

  if (!canManageFull) return null;

  return (
    <div className="flex gap-2">
      <button disabled={pending} onClick={handleToggle} title={active ? "Desativar" : "Ativar"} className="text-brown-500 hover:text-brown-700">
        {active ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button disabled={pending} onClick={handleDuplicate} title="Duplicar" className="text-brown-500 hover:text-brown-700">
        <Copy size={16} />
      </button>
      <button disabled={pending} onClick={handleDelete} title="Excluir" className="text-red-500 hover:text-red-700">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
