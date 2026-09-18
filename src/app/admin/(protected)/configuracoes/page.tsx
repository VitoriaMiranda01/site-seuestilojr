import { requireAdminRole } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/settings";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import { updateSiteSettings } from "./actions";

export default async function AdminSettingsPage() {
  await requireAdminRole(["super_admin"]);
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Configurações</h1>
      <p className="mb-6 text-sm text-brown-400">
        Essas informações são usadas em todo o site: cabeçalho, rodapé, botão de WhatsApp, cálculo de frete e mais.
      </p>
      <SiteSettingsForm action={updateSiteSettings} settings={settings} />
    </div>
  );
}
