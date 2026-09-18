"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createPromoMessage } from "./actions";

export default function NewPromoMessageForm() {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createPromoMessage(formData);
        toast.success("Mensagem adicionada.");
        formRef.current?.reset();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao adicionar mensagem.");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2">
      <input
        name="message"
        required
        placeholder="Ex: FRETE GRÁTIS ACIMA DE R$ 299"
        className="flex-1 rounded-full border border-cream-400 px-4 py-2 text-sm outline-none"
      />
      <button disabled={pending} className="btn-primary shrink-0">
        <Plus size={16} /> Adicionar
      </button>
    </form>
  );
}
