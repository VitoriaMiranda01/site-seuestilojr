import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import ProductForm from "@/components/admin/ProductForm";
import ProductImagesManager from "@/components/admin/ProductImagesManager";
import ProductVariantsManager from "@/components/admin/ProductVariantsManager";
import { updateProduct } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const admin = await requireAdminRole(["super_admin", "admin", "estoque"]);
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, product_images(*), product_variants(*)").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  if (!product) notFound();

  const stockOnly = admin.role === "estoque";
  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Editar Produto</h1>
      <ProductForm action={boundUpdate} categories={categories ?? []} product={product} stockOnly={stockOnly} />

      {!stockOnly && (
        <div className="max-w-4xl space-y-6">
          <ProductImagesManager productId={id} images={product.product_images ?? []} />
          <ProductVariantsManager productId={id} variants={product.product_variants ?? []} />
        </div>
      )}
    </div>
  );
}
