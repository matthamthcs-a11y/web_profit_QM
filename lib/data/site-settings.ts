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

export async function getSiteSettings() {
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
