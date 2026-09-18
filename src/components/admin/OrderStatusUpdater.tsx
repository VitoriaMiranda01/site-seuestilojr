"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/admin/(protected)/pedidos/actions";
import type { Enums } from "@/lib/supabase/types";
import { ORDER_STATUS_LABELS } from "@/lib/format";

const STATUSES: Enums<"order_status">[] = ["pending", "paid", "processing", "shipped", "delivered", "canceled", "refunded"];

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: Enums<"order_status"> }) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status, note || undefined);
        toast.success("Status atualizado.");
        setNote("");
      } catch {
        toast.error("Não foi possível atualizar o status.");
      }
    });
  }

  return (
    <div className="space-y-2 rounded-2xl bg-white p-5 shadow-card">
      <p className="text-sm font-medium text-ink">Status do pedido</p>
      <select value={status} onChange={(e) => setStatus(e.target.value as Enums<"order_status">)} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none">
        {STATUSES.map((s) => (
          <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
        ))}
      </select>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Observação (opcional)"
        rows={2}
        className="w-full rounded-2xl border border-cream-400 px-4 py-2 text-sm outline-none"
      />
      <button onClick={handleSave} disabled={pending} className="btn-primary w-full">
        {pending ? "Salvando..." : "Atualizar status"}
      </button>
    </div>
  );
}
