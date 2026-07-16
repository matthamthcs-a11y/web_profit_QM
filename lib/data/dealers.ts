import { unstable_cache } from "next/cache";
import { dealers } from "@/lib/mock-data";
import { mapDealerRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

const getDealersCached = unstable_cache(
  async () => getDealersUncached(),
  ["profitness-dealers"],
  { revalidate: 300, tags: ["dealers"] },
);

export async function getDealers() {
  return getDealersCached();
}

async function getDealersUncached() {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return dealers;
  }

  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return dealers;
  }

  return data.map(mapDealerRow);
}
