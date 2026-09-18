"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/conta/redefinir-senha`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível enviar o e-mail de recuperação.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="container-store flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">Recuperar senha</h1>
        {sent ? (
          <p className="text-sm text-green-700">
            Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
          </p>
        ) : (
          <>
            <p className="text-sm text-brown-400">Informe seu e-mail para receber o link de recuperação.</p>
            <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-full border border-cream-400 px-4 py-3 text-sm outline-none" />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          </>
        )}
        <p className="text-center text-xs text-brown-500">
          <Link href="/conta/login" className="underline">Voltar para o login</Link>
        </p>
      </form>
    </div>
  );
}
