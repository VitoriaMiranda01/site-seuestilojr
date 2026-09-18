import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import CategoryForm from "@/components/admin/CategoryForm";
import { updateCategory } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  await requireAdminRole(["super_admin", "admin", "editor_marketing"]);
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Editar Categoria</h1>
      <CategoryForm action={updateCategory.bind(null, id)} category={category} />
    </div>
  );
}
