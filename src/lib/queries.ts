import { createClient } from "./supabase/server";
import type { Product } from "./supabase/types";

const PRODUCT_SELECT = "*, product_images(*), product_variants(*), categories(*)";

export async function getHomeData() {
  const supabase = await createClient();

  const [banners, categories, featured, newArrivals, bestsellers, offers, kits] = await Promise.all([
    supabase.from("banners").select("*").eq("active", true).order("sort_order"),
    supabase.from("categories").select("*").eq("active", true).order("sort_order"),
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("is_bestseller", true)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("is_offer", true)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("product_kits").select("*").eq("active", true).limit(6),
  ]);

  const wigsCategoryIds = (categories.data ?? [])
    .filter((c) => c.group_name === "wigs_e_cabelos")
    .map((c) => c.id);
  const accessoryCategoryIds = (categories.data ?? [])
    .filter((c) => c.group_name === "acessorios")
    .map((c) => c.id);

  const [wigsHighlight, accessoriesHighlight] = await Promise.all([
    wigsCategoryIds.length
      ? supabase
          .from("products")
          .select(PRODUCT_SELECT)
          .eq("active", true)
          .in("category_id", wigsCategoryIds)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as Product[] }),
    accessoryCategoryIds.length
      ? supabase
          .from("products")
          .select(PRODUCT_SELECT)
          .eq("active", true)
          .in("category_id", accessoryCategoryIds)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as Product[] }),
  ]);

  return {
    banners: banners.data ?? [],
    categories: categories.data ?? [],
    featured: (featured.data ?? []) as Product[],
    newArrivals: (newArrivals.data ?? []) as Product[],
    bestsellers: (bestsellers.data ?? []) as Product[],
    offers: (offers.data ?? []) as Product[],
    kits: kits.data ?? [],
    wigsHighlight: (wigsHighlight.data ?? []) as Product[],
    accessoriesHighlight: (accessoriesHighlight.data ?? []) as Product[],
  };
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return data;
}

export async function getProductsByCategory(
  categoryId: string,
  opts: { sort?: string; color?: string; length?: string; texture?: string; size?: string } = {},
) {
  const supabase = await createClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("active", true).eq("category_id", categoryId);

  if (opts.color) query = query.eq("color", opts.color);
  if (opts.length) query = query.eq("hair_length", opts.length);
  if (opts.texture) query = query.eq("texture", opts.texture);
  if (opts.size) query = query.eq("size", opts.size);

  switch (opts.sort) {
    case "preco-asc":
      query = query.order("price", { ascending: true });
      break;
    case "preco-desc":
      query = query.order("price", { ascending: false });
      break;
    case "novidades":
      query = query.order("created_at", { ascending: false });
      break;
    case "mais-vendidos":
      query = query.order("is_bestseller", { ascending: false });
      break;
    default:
      query = query.order("is_featured", { ascending: false });
  }

  const { data } = await query;
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  return data as Product | null;
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string) {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(8);
  return (data ?? []) as Product[];
}

export async function getApprovedReviews(productId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function searchProducts(params: {
  q?: string;
  categorySlug?: string;
  sort?: string;
  offers?: boolean;
  featured?: boolean;
  isNew?: boolean;
  bestseller?: boolean;
  minPrice?: number;
  maxPrice?: number;
}) {
  const supabase = await createClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("active", true);

  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }
  if (params.categorySlug) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", params.categorySlug).maybeSingle();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (params.offers) query = query.eq("is_offer", true);
  if (params.featured) query = query.eq("is_featured", true);
  if (params.isNew) query = query.eq("is_new", true);
  if (params.bestseller) query = query.eq("is_bestseller", true);
  if (params.minPrice !== undefined) query = query.gte("price", params.minPrice);
  if (params.maxPrice !== undefined) query = query.lte("price", params.maxPrice);

  switch (params.sort) {
    case "preco-asc":
      query = query.order("price", { ascending: true });
      break;
    case "preco-desc":
      query = query.order("price", { ascending: false });
      break;
    case "novidades":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("is_featured", { ascending: false });
  }

  const { data } = await query;
  return (data ?? []) as Product[];
}
