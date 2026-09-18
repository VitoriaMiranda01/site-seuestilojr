import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  await requireAdminRole(["super_admin", "admin"]);
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Novo Produto</h1>
      <ProductForm action={createProduct} categories={categories ?? []} />
    </div>
  );
}
