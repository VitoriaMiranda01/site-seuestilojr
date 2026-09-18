"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevância" },
  { value: "novidades", label: "Novidades" },
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
];

export default function SortAndFilters({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <p className="text-sm text-brown-400">{resultCount} produtos encontrados</p>
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-brown-400" />
        <select
          defaultValue={searchParams.get("sort") ?? "relevancia"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-full border border-cream-400 bg-white px-4 py-2 text-sm outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
