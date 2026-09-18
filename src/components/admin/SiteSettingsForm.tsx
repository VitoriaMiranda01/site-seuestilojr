"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/settings";

export default function SiteSettingsForm({
  action,
  settings,
}: {
  action: (formData: FormData) => Promise<void>;
  settings: SiteSettings;
}) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Configurações salvas.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar configurações.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <section className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-medium text-ink">Identidade da loja</h2>
        <label className="block text-sm">
          Nome da loja
          <input name="store_name" defaultValue={settings.store_name} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <div className="flex gap-3">
          <label className="block flex-1 text-sm">
            Logo (URL)
            <input name="logo_url" defaultValue={settings.logo_url ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
          <label className="block flex-1 text-sm">
            Favicon (URL)
            <input name="favicon_url" defaultValue={settings.favicon_url ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-medium text-ink">Contato e redes sociais</h2>
        <label className="block text-sm">
          WhatsApp (com DDI e DDD, só números)
          <input name="whatsapp_number" defaultValue={settings.whatsapp_number} placeholder="5511999999999" className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          Instagram (URL)
          <input name="instagram_url" defaultValue={settings.instagram_url} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          E-mail de contato
          <input type="email" name="contact_email" defaultValue={settings.contact_email} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-medium text-ink">Frete</h2>
        <div className="flex gap-3">
          <label className="block flex-1 text-sm">
            Valor fixo de frete (R$)
            <input type="number" step="0.01" min="0" name="shipping_flat_rate" defaultValue={settings.shipping_flat_rate} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
          <label className="block flex-1 text-sm">
            Frete grátis a partir de (R$)
            <input type="number" step="0.01" min="0" name="free_shipping_threshold" defaultValue={settings.free_shipping_threshold} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
          </label>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-medium text-ink">Rodapé e políticas</h2>
        <label className="block text-sm">
          Texto "sobre" do rodapé
          <textarea name="footer_about" defaultValue={settings.footer_about} rows={3} className="mt-1 w-full rounded-2xl border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
        <label className="block text-sm">
          Link das políticas (trocas, privacidade etc.)
          <input name="policies_url" defaultValue={settings.policies_url ?? ""} className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
        </label>
      </section>

      <button disabled={pending} className="btn-primary">{pending ? "Salvando..." : "Salvar configurações"}</button>
    </form>
  );
}
