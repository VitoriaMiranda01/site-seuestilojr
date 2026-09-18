"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteCoupon, toggleCouponActive } from "@/app/admin/(protected)/cupons/actions";

export default function CouponRowActions({ couponId, active }: { couponId: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      try {
        await toggleCouponActive(couponId, !active);
        toast.success(active ? "Cupom desativado." : "Cupom ativado.");
      } catch {
        toast.error("Não foi possível atualizar o cupom.");
      }
    });
  }

  function remove() {
    if (!confirm("Excluir este cupom?")) return;
    startTransition(async () => {
      try {
        await deleteCoupon(couponId);
        toast.success("Cupom excluído.");
      } catch {
        toast.error("Não foi possível excluir o cupom.");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button disabled={pending} onClick={toggle} className="text-xs font-medium text-brown-600 hover:underline">
        {active ? "Desativar" : "Ativar"}
      </button>
      <button disabled={pending} onClick={remove} className="text-red-500 hover:text-red-700">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
