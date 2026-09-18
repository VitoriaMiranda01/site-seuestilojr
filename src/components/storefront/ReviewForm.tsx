"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.info("Entre na sua conta para avaliar este produto.");
      window.location.href = "/conta/login";
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", userData.user.id).maybeSingle();
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      profile_id: userData.user.id,
      customer_name: profile?.full_name || "Cliente",
      rating,
      comment,
    });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível enviar sua avaliação.");
      return;
    }
    toast.success("Avaliação enviada! Ela aparecerá após moderação.");
    setComment("");
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3 rounded-2xl bg-cream-200 p-5">
      <p className="text-sm font-medium text-ink">Deixe sua avaliação</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} estrelas`}>
            <Star size={20} className={n <= rating ? "fill-gold-400 text-gold-400" : "text-brown-300"} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Conte como foi sua experiência com o produto..."
        rows={3}
        className="w-full rounded-xl border border-cream-400 bg-white p-3 text-sm outline-none"
      />
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
