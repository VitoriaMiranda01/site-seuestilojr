"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, phone: form.phone } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("already") ? "Este e-mail já está cadastrado." : "Não foi possível criar sua conta.");
      return;
    }
    toast.success("Conta criada! Você já pode fazer login.");
    router.push("/conta/login");
  }

  return (
    <div className="container-store flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">Criar minha conta</h1>
        <input required placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-3 text-sm outline-none" />
        <input required type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-3 text-sm outline-none" />
        <input required placeholder="Telefone/WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-3 text-sm outline-none" />
        <input required type="password" placeholder="Senha (mín. 6 caracteres)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-3 text-sm outline-none" />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Criando..." : "Criar conta"}
        </button>
        <p className="text-center text-xs text-brown-500">
          Já tem conta? <Link href="/conta/login" className="underline">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
