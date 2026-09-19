import { getHomeData } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import HeroBanner from "@/components/storefront/HeroBanner";
import CategoryCarousel from "@/components/storefront/CategoryCarousel";
import CollectionBanners from "@/components/storefront/CollectionBanners";
import ProductRail from "@/components/storefront/ProductRail";
import KitsSection from "@/components/storefront/KitsSection";
import Benefits from "@/components/storefront/Benefits";
import Testimonials from "@/components/storefront/Testimonials";
import WhatsAppSection from "@/components/storefront/WhatsAppSection";
import InstagramSection from "@/components/storefront/InstagramSection";
import NewsletterForm from "@/components/storefront/NewsletterForm";

export default async function HomePage() {
  const [data, settings] = await Promise.all([getHomeData(), getSiteSettings()]);

  return (
    <div className="animate-fadeIn">
      <HeroBanner banners={data.banners} />

      <Benefits />

      <section className="container-store py-8">
        <CategoryCarousel categories={data.categories} />
      </section>

      <ProductRail title="Produtos em Destaque" products={data.featured} seeAllHref="/busca?destaque=1" />

      <CollectionBanners banners={data.collectionBanners} />

      <div className="section-beige">
        <ProductRail
          title="Laces & Wigs em Destaque"
          subtitle="Acabamento natural, prontas para transformar seu visual"
          products={data.wigsHighlight}
          seeAllHref="/categoria/laces"
        />
      </div>

      <ProductRail
        title="Acessórios para Wigs"
        subtitle="Tudo para instalação, fixação e manutenção"
        products={data.accessoriesHighlight}
        seeAllHref="/categoria/toucas"
      />

      <div className="section-beige">
        <ProductRail title="Lançamentos" products={data.newArrivals} seeAllHref="/busca?novidades=1" />
      </div>

      <ProductRail title="Ofertas Especiais" products={data.offers} seeAllHref="/busca?ofertas=1" />

      <div className="section-beige">
        <ProductRail title="Mais Vendidos" products={data.bestsellers} seeAllHref="/busca?mais-vendidos=1" />
      </div>

      <Testimonials reviews={data.testimonials} />

      <KitsSection kits={data.kits} />

      <WhatsAppSection number={settings.whatsapp_number} />

      <InstagramSection instagramUrl={settings.instagram_url} />

      <NewsletterForm />
    </div>
  );
}
