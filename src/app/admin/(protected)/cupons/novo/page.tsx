import { requireAdminRole } from "@/lib/admin-auth";
import CouponForm from "@/components/admin/CouponForm";
import { createCoupon } from "../actions";

export default async function NewCouponPage() {
  await requireAdminRole(["super_admin", "admin"]);
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Novo Cupom</h1>
      <CouponForm action={createCoupon} />
    </div>
  );
}
