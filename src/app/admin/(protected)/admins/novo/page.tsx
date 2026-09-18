import { requireAdminRole } from "@/lib/admin-auth";
import AdminUserForm from "@/components/admin/AdminUserForm";
import { createAdminUser } from "../actions";

export default async function NewAdminUserPage() {
  await requireAdminRole(["super_admin"]);
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Novo Administrador</h1>
      <p className="mb-6 text-sm text-brown-400">
        Uma conta de acesso ao painel será criada com a senha provisória informada. Recomende que a pessoa a altere no primeiro acesso.
      </p>
      <AdminUserForm action={createAdminUser} />
    </div>
  );
}
