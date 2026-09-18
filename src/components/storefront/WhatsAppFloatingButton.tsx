import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatingButton({ number }: { number: string }) {
  const clean = number.replace(/\D/g, "");
  return (
    <a
      href={`https://wa.me/${clean}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de tirar uma dúvida.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}
