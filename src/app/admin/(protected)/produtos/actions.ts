"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";
import { slugify } from "@/lib/format";

const WRITE_ROLES = ["super_admin", "admin", "estoque"] as const;
const FULL_WRITE_ROLES = ["super_admin", "admin"] as const;

function num(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function str(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  const s = value.toString().trim();
  return s === "" ? null : s;
}

export async function createProduct(formData: FormData) {
  const admin = await requireAdminRole(FULL_WRITE_ROLES);
  const supabase = await createClient();

  const name = str(formData.get("name"))!;
  const slug = slugify(str(formData.get("slug")) || name);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      short_description: str(formData.get("short_description")),
      description: str(formData.get("description")),
      category_id: str(formData.get("category_id")),
      brand: str(formData.get("brand")),
      sku: str(formData.get("sku")),
      price: num(formData.get("price")) ?? 0,
      sale_price: num(formData.get("sale_price")),
      stock: num(formData.get("stock")) ?? 0,
      color: str(formData.get("color")),
      size: str(formData.get("size")),
      hair_length: str(formData.get("hair_length")),
      texture: str(formData.get("texture")),
      weight_grams: num(formData.get("weight_grams")),
      is_featured: formData.get("is_featured") === "on",
      is_new: formData.get("is_new") === "on",
      is_bestseller: formData.get("is_bestseller") === "on",
      is_offer: formData.get("is_offer") === "on",
      active: formData.get("active") === "on",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Não foi possível criar o produto.");
  }

  await logAdminAction(admin, "create", "product", data.id, { name });
  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${data.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const admin = await requireAdminRole(WRITE_ROLES);
  const supabase = await createClient();

  const isStockOnly = admin.role === "estoque";

  const payload = isStockOnly
    ? {
        stock: num(formData.get("stock")) ?? 0,
        sku: str(formData.get("sku")),
      }
    : {
        name: str(formData.get("name"))!,
        slug: slugify(str(formData.get("slug")) || str(formData.get("name"))!),
        short_description: str(formData.get("short_description")),
        description: str(formData.get("description")),
        category_id: str(formData.get("category_id")),
        brand: str(formData.get("brand")),
        sku: str(formData.get("sku")),
        price: num(formData.get("price")) ?? 0,
        sale_price: num(formData.get("sale_price")),
        stock: num(formData.get("stock")) ?? 0,
        color: str(formData.get("color")),
        size: str(formData.get("size")),
        hair_length: str(formData.get("hair_length")),
        texture: str(formData.get("texture")),
        weight_grams: num(formData.get("weight_grams")),
        is_featured: formData.get("is_featured") === "on",
        is_new: formData.get("is_new") === "on",
        is_bestseller: formData.get("is_bestseller") === "on",
        is_offer: formData.get("is_offer") === "on",
        active: formData.get("active") === "on",
      };

  const { error } = await supabase.from("products").update(payload).eq("id", productId);
  if (error) throw new Error(error.message);

  await logAdminAction(admin, "update", "product", productId, payload);
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
}

export async function toggleProductActive(productId: string, active: boolean) {
  const admin = await requireAdminRole(FULL_WRITE_ROLES);
  const supabase = await createClient();
  await supabase.from("products").update({ active }).eq("id", productId);
  await logAdminAction(admin, active ? "activate" : "deactivate", "product", productId);
  revalidatePath("/admin/produtos");
}

export async function deleteProduct(productId: string) {
  const admin = await requireAdminRole(FULL_WRITE_ROLES);
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);
  await logAdminAction(admin, "delete", "product", productId);
  revalidatePath("/admin/produtos");
}

export async function duplicateProduct(productId: string) {
  const admin = await requireAdminRole(FULL_WRITE_ROLES);
  const supabase = await createClient();

  const { data: original } = await supabase.from("products").select("*").eq("id", productId).single();
  if (!original) throw new Error("Produto não encontrado.");

  const { id, created_at, updated_at, slug, sku, avg_rating, reviews_count, ...rest } = original;
  const newSlug = `${slug}-copia-${Date.now().toString().slice(-5)}`;

  const { data: copy, error } = await supabase
    .from("products")
    .insert({ ...rest, slug: newSlug, sku: sku ? `${sku}-COPY` : null, active: false })
    .select("id")
    .single();

  if (error || !copy) throw new Error(error?.message ?? "Não foi possível duplicar.");

  const { data: images } = await supabase.from("product_images").select("url, alt, sort_order").eq("product_id", productId);
  if (images && images.length > 0) {
    await supabase.from("product_images").insert(images.map((img) => ({ ...img, product_id: copy.id })));
  }

  await logAdminAction(admin, "duplicate", "product", copy.id, { from: productId });
  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${copy.id}`);
}

export async function addProductImage(productId: string, url: string, sortOrder: number) {
  const admin = await requireAdminRole(WRITE_ROLES);
  const supabase = await createClient();
  const { error } = await supabase.from("product_images").insert({ product_id: productId, url, sort_order: sortOrder });
  if (error) throw new Error(error.message);
  await logAdminAction(admin, "add_image", "product", productId);
  revalidatePath(`/admin/produtos/${productId}`);
}

export async function removeProductImage(imageId: string, productId: string) {
  const admin = await requireAdminRole(WRITE_ROLES);
  const supabase = await createClient();
  await supabase.from("product_images").delete().eq("id", imageId);
  await logAdminAction(admin, "remove_image", "product", productId);
  revalidatePath(`/admin/produtos/${productId}`);
}

export async function upsertVariant(productId: string, formData: FormData) {
  const admin = await requireAdminRole(WRITE_ROLES);
  const supabase = await createClient();

  const variantId = str(formData.get("variant_id"));
  const payload = {
    product_id: productId,
    color: str(formData.get("color")),
    size: str(formData.get("size")),
    hair_length: str(formData.get("hair_length")),
    texture: str(formData.get("texture")),
    sku: str(formData.get("sku")),
    stock: num(formData.get("stock")) ?? 0,
    price_override: num(formData.get("price_override")),
  };

  if (variantId) {
    await supabase.from("product_variants").update(payload).eq("id", variantId);
  } else {
    await supabase.from("product_variants").insert(payload);
  }

  await logAdminAction(admin, variantId ? "update_variant" : "create_variant", "product", productId);
  revalidatePath(`/admin/produtos/${productId}`);
}

export async function deleteVariant(variantId: string, productId: string) {
  const admin = await requireAdminRole(WRITE_ROLES);
  const supabase = await createClient();
  await supabase.from("product_variants").delete().eq("id", variantId);
  await logAdminAction(admin, "delete_variant", "product", productId);
  revalidatePath(`/admin/produtos/${productId}`);
}
