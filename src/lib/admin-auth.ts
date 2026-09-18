import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import type { AdminRole, AdminUser } from "./supabase/types";

/**
 * Returns the logged-in admin/staff user (from `admin_users`), or null if
 * the current session isn't authenticated or isn't a staff account.
 * This never trusts the client — it re-reads the session server-side.
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", authData.user.id)
    .eq("active", true)
    .maybeSingle();

  return adminUser ?? null;
}

/**
 * Guards an admin page/server action. Redirects to /admin/login when there
 * is no active staff session, and to /admin (with an error flag) when the
 * session exists but doesn't hold one of the allowed roles.
 * IMPORTANT: this is the real authorization boundary — RLS backs it up,
 * but every admin mutation must also call this (or requireAdminRole) itself
 * rather than relying on the UI hiding a button.
 */
export async function requireAdminRole(allowedRoles?: readonly AdminRole[]): Promise<AdminUser> {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }
  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    redirect("/admin?erro=sem-permissao");
  }
  return admin;
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrador",
  editor_marketing: "Editor/Marketing",
  atendimento: "Atendimento",
  estoque: "Estoque",
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: "Acesso total, inclusive gestão de administradores e configurações críticas.",
  admin: "Gerencia produtos, categorias, banners, pedidos, clientes e cupons.",
  editor_marketing: "Gerencia banners, campanhas, categorias e conteúdo visual da Home.",
  atendimento: "Visualiza clientes e pedidos, atualiza status de pedidos.",
  estoque: "Atualiza estoque, SKU e variações de produtos.",
};
