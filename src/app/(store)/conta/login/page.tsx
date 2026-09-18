"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("E-mail ou senha incorretos.");
      return;
    }
    toast.success("Login realizado!");
    router.push("/conta");
    router.refresh();
  }

  return (
    <div className="container-store flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">Entrar na minha conta</h1>
        <input
          required
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full border border-cream-400 px-4 py-3 text-sm outline-none"
        />
        <input
          required
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-full border border-cream-400 px-4 py-3 text-sm outline-none"
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <div className="flex justify-between text-xs text-brown-500">
          <Link href="/conta/recuperar-senha" className="underline">Esqueci minha senha</Link>
          <Link href="/conta/cadastro" className="underline">Criar conta</Link>
        </div>
      </form>
    </div>
  );
}
