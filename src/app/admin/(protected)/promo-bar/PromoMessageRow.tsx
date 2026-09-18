"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { togglepromoMessage, deletePromoMessage, reorderPromoMessage } from "./actions";
import type { PromoMessage } from "@/lib/supabase/types";

export default function PromoMessageRow({ message }: { message: PromoMessage }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-card">
      <span className="text-sm">{message.message}</span>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-brown-400">
          <input
            type="checkbox"
            defaultChecked={message.active}
            disabled={pending}
            onChange={(e) => startTransition(() => togglepromoMessage(message.id, e.target.checked))}
          />
          Ativa
        </label>
        <button disabled={pending} onClick={() => startTransition(() => reorderPromoMessage(message.id, "up"))} className="text-brown-500"><ArrowUp size={16} /></button>
        <button disabled={pending} onClick={() => startTransition(() => reorderPromoMessage(message.id, "down"))} className="text-brown-500"><ArrowDown size={16} /></button>
        <button
          disabled={pending}
          onClick={() => {
            if (confirm("Excluir esta mensagem?")) startTransition(async () => { await deletePromoMessage(message.id); toast.success("Removida."); });
          }}
          className="text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
