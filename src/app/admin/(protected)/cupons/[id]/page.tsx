import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import CouponForm from "@/components/admin/CouponForm";
import { updateCoupon } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditCouponPage({ params }: Props) {
  await requireAdminRole(["super_admin", "admin"]);
  const { id } = await params;
  const supabase = await createClient();
  const { data: coupon } = await supabase.from("coupons").select("*").eq("id", id).maybeSingle();
  if (!coupon) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Editar Cupom</h1>
      <CouponForm action={updateCoupon.bind(null, id)} coupon={coupon} />
    </div>
  );
}
