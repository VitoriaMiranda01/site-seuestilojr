import Link from "next/link";
import { Instagram, MessageCircle, Mail } from "lucide-react";

export default function Footer({
  storeName,
  footerAbout,
  whatsapp,
  instagram,
  email,
}: {
  storeName: string;
  footerAbout: string;
  whatsapp: string;
  instagram: string;
  email: string;
}) {
  return (
    <footer className="bg-ink text-cream-300">
      <div className="container-store grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-white">{storeName}</h3>
          <p className="mt-3 text-sm leading-relaxed text-cream-400/80">{footerAbout}</p>
          <div className="mt-4 flex gap-3">
            <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2">
              <Instagram size={16} />
            </a>
            <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full bg-white/10 p-2">
              <MessageCircle size={16} />
            </a>
            <a href={`mailto:${email}`} aria-label="E-mail" className="rounded-full bg-white/10 p-2">
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Institucional</p>
          <ul className="space-y-2 text-sm text-cream-400/80">
            <li><Link href="/sobre">Sobre a loja</Link></li>
            <li><Link href="/politicas/trocas">Trocas e devoluções</Link></li>
            <li><Link href="/politicas/privacidade">Política de privacidade</Link></li>
            <li><Link href="/politicas/entrega">Prazos de entrega</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Minha conta</p>
          <ul className="space-y-2 text-sm text-cream-400/80">
            <li><Link href="/conta">Meus pedidos</Link></li>
            <li><Link href="/favoritos">Favoritos</Link></li>
            <li><Link href="/conta/login">Entrar</Link></li>
            <li><Link href="/conta/cadastro">Criar conta</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Atendimento</p>
          <ul className="space-y-2 text-sm text-cream-400/80">
            <li>{email}</li>
            <li>{whatsapp}</li>
            <li>Seg a sex, 9h às 18h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-cream-400/60">
        © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
