import { unstable_cache } from "next/cache";
import type { LocalizedText } from "@/lib/types";
import { defaultSiteSettings, mapSiteSettingsRows } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

export type SiteSettings = {
  hotline: string;
  email: string;
  zaloUrl: string;
  facebookPages: { label: string; url: string }[];
  address: string;
  logoPath: string;
  aboutPage: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    block1Title: LocalizedText;
    block1Content: LocalizedText;
    block2Title: LocalizedText;
    block2List: LocalizedText;
  };
};

const getSiteSettingsCached = unstable_cache(
  async () => getSiteSettingsUncached(),
  ["profitness-site-settings"],
  { revalidate: 300, tags: ["site-settings"] },
);

export async function getSiteSettings(): Promise<SiteSettings> {
  const cached = await getSiteSettingsCached();
  return {
    ...defaultSiteSettings,
    ...cached,
    aboutPage: cached.aboutPage ?? defaultSiteSettings.aboutPage,
  };
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
