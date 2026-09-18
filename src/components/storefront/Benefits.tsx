import { Truck, ShieldCheck, CreditCard, Sparkles } from "lucide-react";

const items = [
  { icon: Truck, title: "Frete para todo o Brasil", desc: "Envio rápido e rastreável" },
  { icon: CreditCard, title: "Parcele em até 12x", desc: "Cartão, Pix e mais" },
  { icon: ShieldCheck, title: "Compra 100% segura", desc: "Seus dados sempre protegidos" },
  { icon: Sparkles, title: "Curadoria especializada", desc: "Produtos selecionados a dedo" },
];

export default function Benefits() {
  return (
    <section className="section-beige py-10">
      <div className="container-store grid grid-cols-2 gap-6 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col items-center gap-2 text-center">
            <item.icon className="text-gold-500" size={28} />
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <p className="text-xs text-brown-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
