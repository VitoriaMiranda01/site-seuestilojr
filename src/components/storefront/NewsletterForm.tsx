"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("Não foi possível cadastrar seu e-mail. Tente novamente.");
      return;
    }
    toast.success("Cadastro realizado! Fique atenta às novidades.");
    setEmail("");
  }

  return (
    <section className="bg-brown-800 py-12">
      <div className="container-store flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-2xl font-semibold text-white lg:text-3xl">
          Receba novidades e promoções exclusivas
        </h2>
        <p className="max-w-md text-sm text-cream-300">
          Cadastre seu e-mail e seja a primeira a saber dos lançamentos e ofertas.
        </p>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            className="w-full rounded-full border-none px-5 py-3 text-sm text-ink outline-none"
          />
          <button type="submit" disabled={loading} className="btn-gold shrink-0">
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </section>
  );
}
