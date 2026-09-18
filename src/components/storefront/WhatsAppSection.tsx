import { MessageCircle } from "lucide-react";

export default function WhatsAppSection({ number }: { number: string }) {
  const clean = number.replace(/\D/g, "");
  return (
    <section className="container-store py-10">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-brown-700 p-8 text-center sm:flex-row sm:text-left lg:p-12">
        <div>
          <h3 className="font-display text-2xl font-semibold text-white">Precisa de ajuda para escolher?</h3>
          <p className="mt-2 text-sm text-cream-300">
            Nossa equipe especializada te ajuda a encontrar a lace, wig ou acessório ideal.
          </p>
        </div>
        <a
          href={`https://wa.me/${clean}`}
          target="_blank"
          rel="noreferrer"
          className="btn-gold shrink-0"
        >
          <MessageCircle size={18} /> Falar no WhatsApp
        </a>
      </div>
    </section>
  );
}
