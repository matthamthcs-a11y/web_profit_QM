import { categories } from "@/lib/mock-data";
import { mapCategoryRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

export async function getCategories() {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return categories;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return categories;
  }

  return data.map(mapCategoryRow);
}

export async function getFeaturedCategories() {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return categories.filter((category) => category);
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return categories.filter((category) => category);
  }

  return data.map(mapCategoryRow);
}
