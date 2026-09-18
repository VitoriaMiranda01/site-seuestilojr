"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const couponCode = useCartStore((s) => s.couponCode);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<{ cost: number; freeShipping: boolean } | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  useEffect(() => setHydrated(true), []);

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const total = Math.max(subtotal - discount, 0) + (shipping?.cost ?? 0);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      const res = await fetch("/api/cupom/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Cupom inválido.");
        setDiscount(0);
        setCoupon(null);
        return;
      }
      setDiscount(data.discount);
      setCoupon(data.code);
      toast.success("Cupom aplicado!");
    } finally {
      setApplying(false);
    }
  }

  async function checkShipping() {
    if (cep.replace(/\D/g, "").length !== 8) {
      toast.error("Informe um CEP válido.");
      return;
    }
    setCalculatingShipping(true);
    try {
      const res = await fetch("/api/frete/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtotal: Math.max(subtotal - discount, 0), cep }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Não foi possível calcular o frete.");
        return;
      }
      setShipping(data);
    } finally {
      setCalculatingShipping(false);
    }
  }

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="container-store flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Seu carrinho está vazio</h1>
        <p className="text-sm text-brown-400">Explore nossos produtos e encontre a peça perfeita para você.</p>
        <Link href="/" className="btn-primary">Continuar comprando</Link>
      </div>
    );
  }

  return (
    <div className="container-store py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Meu Carrinho</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 rounded-2xl bg-white p-4 shadow-card">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/produto/${item.slug}`} className="text-sm font-medium text-ink hover:underline">
                    {item.name}
                  </Link>
                  {item.variantLabel && <p className="text-xs text-brown-400">{item.variantLabel}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-cream-400">
                    <button
                      className="p-2"
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      aria-label="Diminuir"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      className="p-2"
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      aria-label="Aumentar"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-display font-semibold text-brown-700">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.variantId)}
                aria-label="Remover"
                className="self-start text-brown-300 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="w-full space-y-4 lg:w-80">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="mb-2 text-sm font-medium text-ink">Cupom de desconto</p>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Código"
                className="flex-1 rounded-full border border-cream-400 px-4 py-2 text-sm outline-none"
              />
              <button onClick={applyCoupon} disabled={applying} className="btn-secondary px-4">
                Aplicar
              </button>
            </div>
            {couponCode && <p className="mt-2 text-xs text-green-700">Cupom {couponCode} aplicado.</p>}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="mb-2 text-sm font-medium text-ink">Calcular frete</p>
            <div className="flex gap-2">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="CEP"
                className="flex-1 rounded-full border border-cream-400 px-4 py-2 text-sm outline-none"
              />
              <button onClick={checkShipping} disabled={calculatingShipping} className="btn-secondary px-4">
                Calcular
              </button>
            </div>
            {shipping && (
              <p className="mt-2 text-xs text-brown-500">
                {shipping.freeShipping ? "Frete grátis!" : `Frete: ${formatCurrency(shipping.cost)}`}
              </p>
            )}
          </div>

          <div className="space-y-2 rounded-2xl bg-white p-5 shadow-card">
            <div className="flex justify-between text-sm">
              <span className="text-brown-400">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Desconto</span>
                <span>- {formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-brown-400">Frete</span>
              <span>{shipping ? formatCurrency(shipping.cost) : "A calcular"}</span>
            </div>
            <div className="flex justify-between border-t border-cream-300 pt-2 font-display text-lg font-semibold text-ink">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button onClick={() => router.push("/checkout")} className="btn-primary mt-2 w-full">
              Finalizar compra <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
