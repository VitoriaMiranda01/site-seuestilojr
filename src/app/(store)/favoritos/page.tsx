"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/storefront/ProductCard";
import type { Product } from "@/lib/supabase/types";

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("wishlists")
        .select("products(*, product_images(*), product_variants(*))")
        .eq("profile_id", userData.user.id);
      setProducts((data ?? []).map((row) => row.products).filter(Boolean) as unknown as Product[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="container-store py-16 text-center text-sm text-brown-400">Carregando...</div>;

  if (!loggedIn) {
    return (
      <div className="container-store flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Entre para ver seus favoritos</h1>
        <Link href="/conta/login" className="btn-primary">Entrar</Link>
      </div>
    );
  }

  return (
    <div className="container-store py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Meus Favoritos</h1>
      {products.length === 0 ? (
        <p className="text-sm text-brown-400">Você ainda não favoritou nenhum produto.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
