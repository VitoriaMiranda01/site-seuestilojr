import { createClient } from "@/lib/supabase/server";

export default async function PromoBar() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("promo_messages")
    .select("id, message")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  const items = messages && messages.length > 0 ? messages : [{ id: "default", message: "PROMOÇÃO PARA TODO O BRASIL" }];
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden bg-brown-700 py-2 text-white">
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
        {track.map((item, idx) => (
          <span key={`${item.id}-${idx}`} className="text-xs font-medium uppercase tracking-wider">
            {item.message}
          </span>
        ))}
      </div>
    </div>
  );
}
