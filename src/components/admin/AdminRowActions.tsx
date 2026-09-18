"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateAdminRole, toggleAdminActive } from "@/app/admin/(protected)/admins/actions";
import type { AdminRole } from "@/lib/supabase/types";

// Duplicated from "@/lib/admin-auth" — that module is server-only (imports
// "server-only" + next/headers) and can't be pulled into a Client Component.
const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrador",
  editor_marketing: "Editor/Marketing",
  atendimento: "Atendimento",
  estoque: "Estoque",
};

const ROLES: AdminRole[] = ["super_admin", "admin", "editor_marketing", "atendimento", "estoque"];

export default function AdminRowActions({
  adminUserId,
  role,
  active,
  isSelf,
}: {
  adminUserId: string;
  role: AdminRole;
  active: boolean;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function changeRole(newRole: AdminRole) {
    startTransition(async () => {
      try {
        await updateAdminRole(adminUserId, newRole);
        toast.success("Permissão atualizada.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Não foi possível atualizar a permissão.");
      }
    });
  }

  function toggleActive() {
    if (active && !confirm("Desativar este administrador? Ele perderá acesso imediatamente.")) return;
    startTransition(async () => {
      try {
        await toggleAdminActive(adminUserId, !active);
        toast.success(active ? "Administrador desativado." : "Administrador reativado.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Não foi possível atualizar.");
      }
    });
  }

  if (isSelf) {
    return <span className="text-xs text-brown-300">Você</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <select
        disabled={pending}
        value={role}
        onChange={(e) => changeRole(e.target.value as AdminRole)}
        className="rounded-full border border-cream-400 px-2 py-1 text-xs outline-none"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>
      <button disabled={pending} onClick={toggleActive} className="text-xs font-medium text-brown-600 hover:underline">
        {active ? "Desativar" : "Reativar"}
      </button>
    </div>
  );
}
