import Link from "next/link";
import {
  LayoutDashboard, Package, Tags, Image as ImageIcon, Megaphone, ShoppingCart,
  Users, Ticket, ShieldCheck, History, Settings,
} from "lucide-react";
import type { AdminRole } from "@/lib/supabase/types";
import { ROLE_LABELS } from "@/lib/admin-auth";
import SignOutButton from "./SignOutButton";

type NavItem = { href: string; label: string; icon: React.ElementType; roles?: AdminRole[] };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package, roles: ["super_admin", "admin", "estoque", "editor_marketing"] },
  { href: "/admin/categorias", label: "Categorias", icon: Tags, roles: ["super_admin", "admin", "editor_marketing"] },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon, roles: ["super_admin", "admin", "editor_marketing"] },
  { href: "/admin/promo-bar", label: "Barra Promocional", icon: Megaphone, roles: ["super_admin", "admin", "editor_marketing"] },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart, roles: ["super_admin", "admin", "atendimento"] },
  { href: "/admin/clientes", label: "Clientes", icon: Users, roles: ["super_admin", "admin", "atendimento"] },
  { href: "/admin/cupons", label: "Cupons", icon: Ticket, roles: ["super_admin", "admin"] },
  { href: "/admin/admins", label: "Administradores", icon: ShieldCheck, roles: ["super_admin"] },
  { href: "/admin/auditoria", label: "Auditoria", icon: History, roles: ["super_admin", "admin"] },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings, roles: ["super_admin"] },
];

export default function Sidebar({ role, name }: { role: AdminRole; name: string }) {
  const visible = NAV.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-ink text-cream-300">
      <div className="p-6">
        <p className="font-display text-lg font-semibold text-white">Seu Estilo Jr</p>
        <p className="text-xs uppercase tracking-wide text-cream-400/70">Painel Administrativo</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {visible.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="mb-3 text-xs text-cream-400/70">{ROLE_LABELS[role]}</p>
        <SignOutButton />
      </div>
    </aside>
  );
}
