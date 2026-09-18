"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function WishlistButton({ productId }: { productId: string }) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function check() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("product_id", productId)
        .eq("profile_id", userData.user.id)
        .maybeSingle();
      setActive(!!data);
    }
    check();
  }, [productId, supabase]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.info("Entre na sua conta para favoritar produtos.");
      window.location.href = "/conta/login";
      return;
    }
    if (active) {
      await supabase.from("wishlists").delete().eq("product_id", productId).eq("profile_id", userData.user.id);
      setActive(false);
    } else {
      await supabase.from("wishlists").insert({ product_id: productId, profile_id: userData.user.id });
      setActive(true);
      toast.success("Adicionado aos favoritos.");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label="Favoritar"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft transition-transform hover:scale-105"
    >
      <Heart size={16} className={active ? "fill-brown-600 text-brown-600" : "text-brown-400"} />
    </button>
  );
}
