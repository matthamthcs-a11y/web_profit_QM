import { dealers } from "@/lib/mock-data";
import { mapDealerRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

export async function getDealers() {
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
