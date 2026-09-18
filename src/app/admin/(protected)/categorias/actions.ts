"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";
import { slugify } from "@/lib/format";

const ROLES = ["super_admin", "admin", "editor_marketing"] as const;

function str(v: FormDataEntryValue | null) {
  if (v === null) return null;
  const s = v.toString().trim();
  return s === "" ? null : s;
}

export async function createCategory(formData: FormData) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const name = str(formData.get("name"))!;

  const { count } = await supabase.from("categories").select("*", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug: slugify(str(formData.get("slug")) || name),
      description: str(formData.get("description")),
      image_url: str(formData.get("image_url")),
      group_name: (str(formData.get("group_name")) ?? "wigs_e_cabelos") as "wigs_e_cabelos" | "acessorios" | "cuidados",
      highlight: formData.get("highlight") === "on",
      active: formData.get("active") === "on",
      sort_order: count ?? 0,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Não foi possível criar a categoria.");
  await logAdminAction(admin, "create", "category", data.id, { name });
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();
  const name = str(formData.get("name"))!;

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug: slugify(str(formData.get("slug")) || name),
      description: str(formData.get("description")),
      image_url: str(formData.get("image_url")),
      group_name: (str(formData.get("group_name")) ?? "wigs_e_cabelos") as "wigs_e_cabelos" | "acessorios" | "cuidados",
      highlight: formData.get("highlight") === "on",
      active: formData.get("active") === "on",
    })
    .eq("id", categoryId);

  if (error) throw new Error(error.message);
  await logAdminAction(admin, "update", "category", categoryId, { name });
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function deleteCategory(categoryId: string) {
  const admin = await requireAdminRole(["super_admin", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw new Error(error.message);
  await logAdminAction(admin, "delete", "category", categoryId);
  revalidatePath("/admin/categorias");
}

export async function reorderCategory(categoryId: string, direction: "up" | "down") {
  const admin = await requireAdminRole(ROLES);
  const supabase = await createClient();

  const { data: categories } = await supabase.from("categories").select("id, sort_order").order("sort_order");
  if (!categories) return;

  const idx = categories.findIndex((c) => c.id === categoryId);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= categories.length) return;

  const a = categories[idx];
  const b = categories[swapIdx];

  await supabase.from("categories").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("categories").update({ sort_order: a.sort_order }).eq("id", b.id);

  await logAdminAction(admin, "reorder", "category", categoryId);
  revalidatePath("/admin/categorias");
}
