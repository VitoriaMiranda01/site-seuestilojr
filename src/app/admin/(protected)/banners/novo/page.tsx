import { requireAdminRole } from "@/lib/admin-auth";
import BannerForm from "@/components/admin/BannerForm";
import { createBanner } from "../actions";

export default async function NewBannerPage() {
  await requireAdminRole(["super_admin", "admin", "editor_marketing"]);
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Novo Banner</h1>
      <BannerForm action={createBanner} />
    </div>
  );
}
