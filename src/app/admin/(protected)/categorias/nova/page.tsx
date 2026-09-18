import { requireAdminRole } from "@/lib/admin-auth";
import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory } from "../actions";

export default async function NewCategoryPage() {
  await requireAdminRole(["super_admin", "admin", "editor_marketing"]);
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Nova Categoria</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
