import { Star } from "lucide-react";
import { formatDate } from "@/lib/format";
import ReviewForm from "./ReviewForm";
import type { Tables } from "@/lib/supabase/types";

export default function ReviewsSection({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Tables<"reviews">[];
}) {
  return (
    <div className="border-t border-cream-300 py-10">
      <h2 className="mb-4 font-display text-xl font-semibold text-ink">Avaliações de clientes</h2>
      {reviews.length === 0 ? (
        <p className="text-sm text-brown-400">Este produto ainda não possui avaliações.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-cream-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">{r.customer_name}</p>
                <p className="text-xs text-brown-400">{formatDate(r.created_at)}</p>
              </div>
              <div className="my-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < r.rating ? "fill-gold-400 text-gold-400" : "text-brown-300"} />
                ))}
              </div>
              {r.comment && <p className="text-sm text-brown-500">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
      <ReviewForm productId={productId} />
    </div>
  );
}
