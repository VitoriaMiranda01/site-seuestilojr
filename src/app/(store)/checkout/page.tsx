"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/format";

type Address = {
  id: string;
  label: string | null;
  recipient_name: string;
  zip_code: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
};

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();
  const supabase = createClient();

  const [hydrated, setHydrated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    recipientName: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    setHydrated(true);
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setLoggedIn(true);
        const { data: addresses } = await supabase
          .from("addresses")
          .select("*")
          .eq("profile_id", userData.user.id)
          .order("is_default", { ascending: false });
        setSavedAddresses(addresses ?? []);
        if (addresses && addresses[0]) applyAddress(addresses[0]);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyAddress(addr: Address) {
    setForm((f) => ({
      ...f,
      recipientName: addr.recipient_name,
      zipCode: addr.zip_code,
      street: addr.street,
      number: addr.number,
      complement: addr.complement ?? "",
      neighborhood: addr.neighborhood,
      city: addr.city,
      state: addr.state,
    }));
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          couponCode,
          paymentMethod,
          guestEmail: loggedIn ? undefined : form.guestEmail,
          guestName: loggedIn ? undefined : form.guestName,
          guestPhone: loggedIn ? undefined : form.guestPhone,
          address: {
            recipientName: form.recipientName,
            zipCode: form.zipCode,
            street: form.street,
            number: form.number,
            complement: form.complement,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Não foi possível finalizar o pedido.");
        setLoading(false);
        return;
      }
      clear();
      window.location.href = data.url;
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="container-store flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Seu carrinho está vazio</h1>
        <Link href="/" className="btn-primary">Continuar comprando</Link>
      </div>
    );
  }

  return (
    <div className="container-store py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Finalizar Compra</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          {!loggedIn && (
            <section className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
              <h2 className="font-medium text-ink">Seus dados</h2>
              <p className="text-xs text-brown-400">
                Já tem conta? <Link href="/conta/login" className="text-brown-600 underline">Entrar</Link>
              </p>
              <input required placeholder="Nome completo" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
              <input required type="email" placeholder="E-mail" value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
              <input required placeholder="Telefone/WhatsApp" value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            </section>
          )}

          <section className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
            <h2 className="font-medium text-ink">Endereço de entrega</h2>

            {loggedIn && savedAddresses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((addr) => (
                  <button
                    type="button"
                    key={addr.id}
                    onClick={() => applyAddress(addr)}
                    className="rounded-full border border-cream-400 px-3 py-1 text-xs hover:border-brown-500"
                  >
                    {addr.label || `${addr.street}, ${addr.number}`}
                  </button>
                ))}
              </div>
            )}

            <input required placeholder="Nome do destinatário" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="CEP" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
              <input required placeholder="Número" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            </div>
            <input required placeholder="Rua" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            <input placeholder="Complemento (opcional)" value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            <div className="grid grid-cols-3 gap-3">
              <input required placeholder="Bairro" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className="col-span-2 rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
              <input required placeholder="UF" maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} className="rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            </div>
            <input required placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </section>

          <section className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
            <h2 className="font-medium text-ink">Forma de pagamento</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm ${paymentMethod === "card" ? "border-brown-600 bg-cream-200" : "border-cream-400"}`}
              >
                Cartão de crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm ${paymentMethod === "pix" ? "border-brown-600 bg-cream-200" : "border-cream-400"}`}
              >
                Pix
              </button>
            </div>
          </section>
        </div>

        <div className="w-full lg:w-80">
          <div className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
            <h2 className="font-medium text-ink">Resumo do pedido</h2>
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-xs text-brown-500">
                <span className="line-clamp-1">{item.quantity}x {item.name}</span>
                <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-cream-300 pt-2 font-display text-lg font-semibold">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-brown-400">Frete e descontos calculados no carrinho serão aplicados.</p>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Processando..." : "Ir para pagamento"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
