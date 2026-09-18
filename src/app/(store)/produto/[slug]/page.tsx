import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getApprovedReviews } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import ProductGallery from "@/components/storefront/ProductGallery";
import ProductPurchaseBox from "@/components/storefront/ProductPurchaseBox";
import ProductDetails from "@/components/storefront/ProductDetails";
import ReviewsSection from "@/components/storefront/ReviewsSection";
import ProductRail from "@/components/storefront/ProductRail";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "Produto",
    description: product?.short_description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews, settings] = await Promise.all([
    getRelatedProducts(product.category_id, product.id),
    getApprovedReviews(product.id),
    getSiteSettings(),
  ]);

  return (
    <div className="container-store py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.product_images ?? []} name={product.name} />
        <ProductPurchaseBox product={product} whatsappNumber={settings.whatsapp_number} />
      </div>

      <ProductDetails product={product} />
      <ReviewsSection productId={product.id} reviews={reviews} />

      {related.length > 0 && <ProductRail title="Você também pode gostar" products={related} />}
    </div>
  );
}
