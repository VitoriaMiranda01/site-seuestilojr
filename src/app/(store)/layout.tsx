import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/settings";
import PromoBar from "@/components/storefront/PromoBar";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import WhatsAppFloatingButton from "@/components/storefront/WhatsAppFloatingButton";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const [{ data: categories }, settings] = await Promise.all([
    supabase.from("categories").select("*").eq("active", true).order("sort_order"),
    getSiteSettings(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <PromoBar />
      <Header categories={categories ?? []} storeName={settings.store_name} logoUrl={settings.logo_url} />
      <main className="flex-1">{children}</main>
      <Footer
        storeName={settings.store_name}
        footerAbout={settings.footer_about}
        whatsapp={settings.whatsapp_number}
        instagram={settings.instagram_url}
        email={settings.contact_email}
      />
      <WhatsAppFloatingButton number={settings.whatsapp_number} />
    </div>
  );
}
