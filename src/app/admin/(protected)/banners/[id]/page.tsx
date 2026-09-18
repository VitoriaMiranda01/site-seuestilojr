import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import BannerForm from "@/components/admin/BannerForm";
import { updateBanner } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditBannerPage({ params }: Props) {
  await requireAdminRole(["super_admin", "admin", "editor_marketing"]);
  const { id } = await params;
  const supabase = await createClient();
  const { data: banner } = await supabase.from("banners").select("*").eq("id", id).maybeSingle();
  if (!banner) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Editar Banner</h1>
      <BannerForm action={updateBanner.bind(null, id)} banner={banner} />
    </div>
  );
}
