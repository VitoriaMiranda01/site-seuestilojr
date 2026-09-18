import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import PromoMessageRow from "./PromoMessageRow";
import NewPromoMessageForm from "./NewPromoMessageForm";

export default async function AdminPromoBarPage() {
  await requireAdminRole(["super_admin", "admin", "editor_marketing"]);
  const supabase = await createClient();
  const { data: messages } = await supabase.from("promo_messages").select("*").order("sort_order");

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Barra Promocional</h1>
      <p className="mb-6 text-sm text-brown-400">
        Mensagens exibidas em rotação contínua no topo do site, acima do menu principal.
      </p>

      <NewPromoMessageForm />

      <div className="mt-6 space-y-3">
        {(messages ?? []).map((m) => (
          <PromoMessageRow key={m.id} message={m} />
        ))}
        {(messages ?? []).length === 0 && <p className="text-sm text-brown-400">Nenhuma mensagem cadastrada.</p>}
      </div>
    </div>
  );
}
