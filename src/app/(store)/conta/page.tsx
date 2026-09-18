"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";

type Order = { id: string; order_number: number; status: string; total: number; created_at: string };
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
  is_default: boolean;
};

const TABS = ["pedidos", "dados", "enderecos"] as const;

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<typeof TABS[number]>("pedidos");
  const [profile, setProfile] = useState({ full_name: "", phone: "", email: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState({
    label: "", recipient_name: "", zip_code: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "",
  });

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/conta/login");
        return;
      }
      const [{ data: prof }, { data: ords }, { data: addrs }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userData.user.id).maybeSingle(),
        supabase.from("orders").select("id, order_number, status, total, created_at").eq("profile_id", userData.user.id).order("created_at", { ascending: false }),
        supabase.from("addresses").select("*").eq("profile_id", userData.user.id).order("is_default", { ascending: false }),
      ]);
      if (prof) setProfile({ full_name: prof.full_name ?? "", phone: prof.phone ?? "", email: prof.email ?? "" });
      setOrders(ords ?? []);
      setAddresses(addrs ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profile.full_name, phone: profile.phone })
      .eq("id", userData.user.id);
    if (error) toast.error("Não foi possível salvar seus dados.");
    else toast.success("Dados atualizados.");
  }

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...newAddress, profile_id: userData.user.id, is_default: addresses.length === 0 })
      .select()
      .single();
    if (error || !data) {
      toast.error("Não foi possível salvar o endereço.");
      return;
    }
    setAddresses((prev) => [...prev, data]);
    setNewAddress({ label: "", recipient_name: "", zip_code: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" });
    toast.success("Endereço adicionado.");
  }

  async function removeAddress(id: string) {
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) return <div className="container-store py-16 text-center text-sm text-brown-400">Carregando...</div>;

  return (
    <div className="container-store py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Minha Conta</h1>
        <button onClick={logout} className="text-sm text-brown-500 underline">Sair</button>
      </div>

      <div className="mb-6 flex gap-2 border-b border-cream-300">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${tab === t ? "border-b-2 border-brown-600 text-brown-700" : "text-brown-400"}`}
          >
            {t === "pedidos" ? "Meus Pedidos" : t === "dados" ? "Meus Dados" : "Endereços"}
          </button>
        ))}
      </div>

      {tab === "pedidos" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-brown-400">Você ainda não fez nenhum pedido.</p>
          ) : (
            orders.map((o) => (
              <Link
                key={o.id}
                href={`/conta/pedidos/${o.id}`}
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-medium text-ink">Pedido #{o.order_number}</p>
                  <p className="text-xs text-brown-400">{formatDate(o.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brown-700">{formatCurrency(o.total)}</p>
                  <p className="text-xs text-brown-400">{ORDER_STATUS_LABELS[o.status] ?? o.status}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {tab === "dados" && (
        <form onSubmit={saveProfile} className="max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-card">
          <input placeholder="Nome completo" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          <input placeholder="Telefone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          <input disabled value={profile.email} className="w-full rounded-full border border-cream-300 bg-cream-100 px-4 py-2 text-sm text-brown-400" />
          <button type="submit" className="btn-primary">Salvar alterações</button>
        </form>
      )}

      {tab === "enderecos" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="rounded-2xl bg-white p-4 shadow-card">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-ink">{addr.label || "Endereço"} {addr.is_default && <span className="text-xs text-gold-500">(Padrão)</span>}</p>
                  <button onClick={() => removeAddress(addr.id)} className="text-xs text-red-500 underline">Remover</button>
                </div>
                <p className="text-xs text-brown-400">
                  {addr.street}, {addr.number} {addr.complement && `- ${addr.complement}`} — {addr.neighborhood}, {addr.city}/{addr.state} — {addr.zip_code}
                </p>
              </div>
            ))}
            {addresses.length === 0 && <p className="text-sm text-brown-400">Nenhum endereço cadastrado.</p>}
          </div>
          <form onSubmit={addAddress} className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
            <p className="text-sm font-medium text-ink">Adicionar endereço</p>
            <input placeholder="Rótulo (ex: Casa, Trabalho)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            <input required placeholder="Nome do destinatário" value={newAddress.recipient_name} onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            <div className="grid grid-cols-2 gap-2">
              <input required placeholder="CEP" value={newAddress.zip_code} onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })} className="rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
              <input required placeholder="Número" value={newAddress.number} onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })} className="rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            </div>
            <input required placeholder="Rua" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            <input placeholder="Complemento" value={newAddress.complement} onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            <div className="grid grid-cols-3 gap-2">
              <input required placeholder="Bairro" value={newAddress.neighborhood} onChange={(e) => setNewAddress({ ...newAddress, neighborhood: e.target.value })} className="col-span-2 rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
              <input required placeholder="UF" maxLength={2} value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value.toUpperCase() })} className="rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            </div>
            <input required placeholder="Cidade" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
            <button type="submit" className="btn-primary">Adicionar endereço</button>
          </form>
        </div>
      )}
    </div>
  );
}
