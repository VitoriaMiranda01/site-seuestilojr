"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { AdminRole } from "@/lib/supabase/types";

// NOTE: this is a Client Component, so it can't import from "@/lib/admin-auth"
// (that module pulls in "server-only" + next/headers via the Supabase server
// client). These labels are duplicated here rather than shared from there.
const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrador",
  editor_marketing: "Editor/Marketing",
  atendimento: "Atendimento",
  estoque: "Estoque",
};

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: "Acesso total, inclusive gestão de administradores e configurações críticas.",
  admin: "Gerencia produtos, categorias, banners, pedidos, clientes e cupons.",
  editor_marketing: "Gerencia banners, campanhas, categorias e conteúdo visual da Home.",
  atendimento: "Visualiza clientes e pedidos, atualiza status de pedidos.",
  estoque: "Atualiza estoque, SKU e variações de produtos.",
};

const ROLES: AdminRole[] = ["super_admin", "admin", "editor_marketing", "atendimento", "estoque"];

export default function AdminUserForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao criar administrador.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-card">
      <label className="block text-sm">
        Nome completo *
        <input required name="full_name" className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        E-mail *
        <input required type="email" name="email" className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Senha provisória *
        <input required minLength={8} type="text" name="password" placeholder="mín. 8 caracteres" className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none" />
      </label>
      <label className="block text-sm">
        Permissão (role)
        <select name="role" defaultValue="atendimento" className="mt-1 w-full rounded-full border border-cream-400 px-4 py-2 text-sm outline-none">
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </label>
      <RoleHint />
      <button disabled={pending} className="btn-primary">{pending ? "Criando..." : "Criar administrador"}</button>
    </form>
  );
}

function RoleHint() {
  return (
    <ul className="space-y-1 rounded-xl bg-cream-100 p-3 text-xs text-brown-500">
      {(["super_admin", "admin", "editor_marketing", "atendimento", "estoque"] as AdminRole[]).map((r) => (
        <li key={r}><strong className="text-ink">{ROLE_LABELS[r]}:</strong> {ROLE_DESCRIPTIONS[r]}</li>
      ))}
    </ul>
  );
}
