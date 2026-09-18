"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminRole } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";
import type { AdminRole } from "@/lib/supabase/types";

const ROLES = ["super_admin"] as const;

function str(v: FormDataEntryValue | null) {
  if (v === null) return null;
  const s = v.toString().trim();
  return s === "" ? null : s;
}

/**
 * Creates a new staff/admin account: a Supabase Auth user (via the
 * service-role Admin API) plus its matching `admin_users` row. Requires
 * SUPABASE_SERVICE_ROLE_KEY to be configured — see createAdminClient().
 */
export async function createAdminUser(formData: FormData) {
  const admin = await requireAdminRole(ROLES);

  const fullName = str(formData.get("full_name"))!;
  const email = str(formData.get("email"))!.toLowerCase();
  const password = str(formData.get("password"))!;
  const role = (str(formData.get("role")) ?? "atendimento") as AdminRole;

  if (password.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres.");
  }

  const adminClient = createAdminClient();

  const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError || !authUser?.user) {
    throw new Error(authError?.message ?? "Não foi possível criar o usuário.");
  }

  const { error: insertError } = await adminClient.from("admin_users").insert({
    id: authUser.user.id,
    email,
    full_name: fullName,
    role,
    active: true,
    created_by: admin.id,
  });

  if (insertError) {
    // Roll back the auth user so we don't leave an orphaned login with no
    // admin_users row (which would otherwise fail every RLS/is_admin check).
    await adminClient.auth.admin.deleteUser(authUser.user.id);
    throw new Error(insertError.message);
  }

  await logAdminAction(admin, "create", "admin_user", authUser.user.id, { email, role });
  revalidatePath("/admin/admins");
  redirect("/admin/admins");
}

export async function updateAdminRole(adminUserId: string, role: AdminRole) {
  const admin = await requireAdminRole(ROLES);
  if (adminUserId === admin.id) {
    throw new Error("Você não pode alterar sua própria permissão.");
  }
  const supabase = await createClient();
  const { error } = await supabase.from("admin_users").update({ role }).eq("id", adminUserId);
  if (error) throw new Error(error.message);
  await logAdminAction(admin, "change_role", "admin_user", adminUserId, { role });
  revalidatePath("/admin/admins");
}

export async function toggleAdminActive(adminUserId: string, active: boolean) {
  const admin = await requireAdminRole(ROLES);
  if (adminUserId === admin.id) {
    throw new Error("Você não pode desativar sua própria conta.");
  }
  const supabase = await createClient();
  const { error } = await supabase.from("admin_users").update({ active }).eq("id", adminUserId);
  if (error) throw new Error(error.message);
  await logAdminAction(admin, active ? "activate" : "deactivate", "admin_user", adminUserId);
  revalidatePath("/admin/admins");
}
