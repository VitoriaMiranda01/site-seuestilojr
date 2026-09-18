"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Category } from "@/lib/supabase/types";

type HeaderProps = {
  categories: Category[];
  storeName: string;
  logoUrl: string | null;
};

export default function Header({ categories, storeName, logoUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const count = useCartStore((s) => s.count());

  useEffect(() => setHydrated(true), []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
    }
  }

  const grouped = {
    wigs_e_cabelos: categories.filter((c) => c.group_name === "wigs_e_cabelos"),
    acessorios: categories.filter((c) => c.group_name === "acessorios"),
    cuidados: categories.filter((c) => c.group_name === "cuidados"),
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cream-400 bg-white/95 backdrop-blur">
      <div className="container-store flex h-16 items-center justify-between gap-4 lg:h-20">
        <button
          className="lg:hidden"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          {logoUrl ? (
            <Image src={logoUrl} alt={storeName} width={140} height={44} className="h-9 w-auto object-contain lg:h-11" />
          ) : (
            <span className="font-display text-xl font-semibold tracking-tight text-brown-700 lg:text-2xl">
              {storeName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <div className="group relative">
            <button className="text-sm font-medium text-ink hover:text-brown-600">
              Wigs e Cabelos
            </button>
            <div className="invisible absolute left-0 top-full grid w-64 grid-cols-1 gap-1 rounded-xl bg-white p-4 opacity-0 shadow-soft transition-all group-hover:visible group-hover:opacity-100">
              {grouped.wigs_e_cabelos.map((c) => (
                <Link key={c.id} href={`/categoria/${c.slug}`} className="rounded-lg px-3 py-2 text-sm text-ink hover:bg-cream-200">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="group relative">
            <button className="text-sm font-medium text-ink hover:text-brown-600">
              Acessórios para Wigs
            </button>
            <div className="invisible absolute left-0 top-full grid w-64 grid-cols-1 gap-1 rounded-xl bg-white p-4 opacity-0 shadow-soft transition-all group-hover:visible group-hover:opacity-100">
              {grouped.acessorios.map((c) => (
                <Link key={c.id} href={`/categoria/${c.slug}`} className="rounded-lg px-3 py-2 text-sm text-ink hover:bg-cream-200">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="group relative">
            <button className="text-sm font-medium text-ink hover:text-brown-600">Cuidados</button>
            <div className="invisible absolute left-0 top-full grid w-64 grid-cols-1 gap-1 rounded-xl bg-white p-4 opacity-0 shadow-soft transition-all group-hover:visible group-hover:opacity-100">
              {grouped.cuidados.map((c) => (
                <Link key={c.id} href={`/categoria/${c.slug}`} className="rounded-lg px-3 py-2 text-sm text-ink hover:bg-cream-200">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/busca?ofertas=1" className="text-sm font-medium text-brown-600 hover:text-brown-700">
            Ofertas
          </Link>
        </nav>

        <form onSubmit={submitSearch} className="hidden flex-1 max-w-sm items-center lg:flex">
          <div className="flex w-full items-center gap-2 rounded-full border border-cream-400 bg-cream-100 px-4 py-2">
            <Search size={16} className="text-brown-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-brown-300"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <button className="lg:hidden" aria-label="Buscar" onClick={() => setSearchOpen((v) => !v)}>
            <Search size={22} />
          </button>
          <Link href="/conta" aria-label="Minha conta" className="hidden sm:block">
            <User size={22} />
          </Link>
          <Link href="/favoritos" aria-label="Favoritos" className="hidden sm:block">
            <Heart size={22} />
          </Link>
          <Link href="/carrinho" aria-label="Carrinho" className="relative">
            <ShoppingBag size={22} />
            {hydrated && count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brown-600 px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-cream-400 bg-white p-3 lg:hidden">
          <div className="flex items-center gap-2 rounded-full border border-cream-400 bg-cream-100 px-4 py-2">
            <Search size={16} className="text-brown-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </form>
      )}

      {menuOpen && (
        <nav className="max-h-[70vh] overflow-y-auto border-t border-cream-400 bg-white p-4 lg:hidden">
          <MobileGroup title="Wigs e Cabelos" categories={grouped.wigs_e_cabelos} onNavigate={() => setMenuOpen(false)} />
          <MobileGroup title="Acessórios para Wigs" categories={grouped.acessorios} onNavigate={() => setMenuOpen(false)} />
          <MobileGroup title="Cuidados" categories={grouped.cuidados} onNavigate={() => setMenuOpen(false)} />
          <div className="mt-4 flex gap-4 border-t border-cream-300 pt-4">
            <Link href="/conta" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm">
              <User size={18} /> Minha conta
            </Link>
            <Link href="/favoritos" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm">
              <Heart size={18} /> Favoritos
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function MobileGroup({
  title,
  categories,
  onNavigate,
}: {
  title: string;
  categories: Category[];
  onNavigate: () => void;
}) {
  if (categories.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brown-400">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categoria/${c.slug}`}
            onClick={onNavigate}
            className="rounded-lg bg-cream-200 px-3 py-2 text-sm text-ink"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
