"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível redefinir sua senha. O link pode ter expirado.");
      return;
    }
    toast.success("Senha atualizada!");
    router.push("/conta");
  }

  return (
    <div className="container-store flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">Definir nova senha</h1>
        <input
          required
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-full border border-cream-400 px-4 py-3 text-sm outline-none"
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
