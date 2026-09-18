"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { Coupon } from "@/lib/supabase/types";

function toDateInputValue(v: string | null | undefined) {
  if (!v) return "";
  return v.slice(0, 10);
}

export default function CouponForm({
  action,
  coupon,
}: {
  action: (formData: FormData) => Promise<void>;
  coupon?: Coupon;
}) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar cupom.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-card">
      <label className="block text-sm">
        Código *
        <input
          required
          name="code"
          defaultValue={coupon?.code ?? ""}
          placeholder="BEMVINDA10"
          className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm uppercase outline-none"
        />
      </label>

      <div className="flex gap-3">
        <label className="block flex-1 text-sm">
          Tipo
          <select name="type" defaultValue={coupon?.type ?? "percent"} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none">
            <option value="percent">Percentual (%)</option>
            <option value="fixed">Valor fixo (R$)</option>
          </select>
        </label>
        <label className="block flex-1 text-sm">
          Valor *
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="value"
            defaultValue={coupon?.value ?? ""}
            className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none"
          />
        </label>
      </div>

      <label className="block text-sm">
        Valor mínimo do pedido (R$)
        <input
          type="number"
          step="0.01"
          min="0"
          name="min_order_value"
          defaultValue={coupon?.min_order_value ?? 0}
          className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none"
        />
      </label>

      <label className="block text-sm">
        Limite de uso (deixe em branco para ilimitado)
        <input
          type="number"
          min="1"
          name="usage_limit"
          defaultValue={coupon?.usage_limit ?? ""}
          className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none"
        />
      </label>

      <div className="flex gap-3">
        <label className="block flex-1 text-sm">
          Início (opcional)
          <input type="date" name="starts_at" defaultValue={toDateInputValue(coupon?.starts_at)} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block flex-1 text-sm">
          Expira em (opcional)
          <input type="date" name="expires_at" defaultValue={toDateInputValue(coupon?.expires_at)} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} /> Ativo
      </label>

      {coupon && (
        <p className="text-xs text-brown-400">Usado {coupon.used_count}x até o momento.</p>
      )}

      <button disabled={pending} className="btn-primary">{pending ? "Salvando..." : "Salvar cupom"}</button>
    </form>
  );
}
