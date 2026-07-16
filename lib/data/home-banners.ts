import { unstable_cache } from "next/cache";
import { mapHomeBannerRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

const getHomeBannersCached = unstable_cache(
  async () => getHomeBannersUncached(),
  ["profitness-home-banners"],
  { revalidate: 300, tags: ["home-banners"] },
);

export async function getHomeBanners() {
  return getHomeBannersCached();
}

async function getHomeBannersUncached() {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return [];
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("home_banners")
    .select("*")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map(mapHomeBannerRow);
}
