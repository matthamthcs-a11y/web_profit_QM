import { unstable_cache } from "next/cache";
import { categories } from "@/lib/mock-data";
import { mapCategoryRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

const getCategoriesCached = unstable_cache(
  async () => getCategoriesUncached(),
  ["profitness-categories"],
  { revalidate: 300, tags: ["categories"] },
);

const getFeaturedCategoriesCached = unstable_cache(
  async () => getFeaturedCategoriesUncached(),
  ["profitness-featured-categories"],
  { revalidate: 300, tags: ["categories"] },
);

export async function getCategories() {
  return getCategoriesCached();
}

async function getCategoriesUncached() {
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
  return getFeaturedCategoriesCached();
}

async function getFeaturedCategoriesUncached() {
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
