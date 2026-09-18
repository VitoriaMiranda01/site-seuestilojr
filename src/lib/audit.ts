import "server-only";
import { createClient } from "./supabase/server";
import type { AdminUser } from "./supabase/types";
import type { Json } from "./supabase/types";

/**
 * Records an admin action in `audit_log`. Call this after every sensitive
 * write (product/price/stock changes, banner or coupon CRUD, order status
 * changes, permission changes, admin creation/deletion...).
 */
export async function logAdminAction(
  admin: AdminUser,
  action: string,
  resourceType: string,
  resourceId?: string | null,
  details?: Record<string, unknown>,
) {
  const supabase = await createClient();
  await supabase.from("audit_log").insert({
    admin_user_id: admin.id,
    admin_email: admin.email,
    action,
    resource_type: resourceType,
    resource_id: resourceId ?? null,
    details: (details as Json) ?? null,
  });
}
