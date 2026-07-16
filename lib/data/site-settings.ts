import { unstable_cache } from "next/cache";
import { defaultSiteSettings, mapSiteSettingsRows } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

export type SiteSettings = {
  hotline: string;
  email: string;
  zaloUrl: string;
  facebookLabel: string;
  facebookUrl: string;
  address: string;
};

const getSiteSettingsCached = unstable_cache(
  async () => getSiteSettingsUncached(),
  ["profitness-site-settings"],
  { revalidate: 300, tags: ["site-settings"] },
);

export async function getSiteSettings() {
  return getSiteSettingsCached();
}

async function getSiteSettingsUncached() {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return defaultSiteSettings;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  if (error || !data) {
    return defaultSiteSettings;
  }

  return mapSiteSettingsRows(data);
}
