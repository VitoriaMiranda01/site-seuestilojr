"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (attempts >= 5) {
      toast.error("Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !authData.user) {
      setAttempts((a) => a + 1);
      setLoading(false);
      toast.error("E-mail ou senha incorretos.");
      return;
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id, active")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (!adminUser || !adminUser.active) {
      await supabase.auth.signOut();
      setAttempts((a) => a + 1);
      setLoading(false);
      toast.error("Este usuário não tem acesso ao painel administrativo.");
      return;
    }

    toast.success("Login realizado!");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-soft">
        <div className="text-center">
          <p className="font-display text-2xl font-semibold text-brown-700">Seu Estilo Jr</p>
          <p className="text-xs uppercase tracking-wide text-brown-400">Painel Administrativo</p>
        </div>
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
      </form>
    </div>
  );
}
