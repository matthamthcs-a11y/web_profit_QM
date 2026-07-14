import { documents } from "@/lib/mock-data";
import { mapDocumentRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

export async function getDocuments() {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return documents;
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return documents;
  }

  return data.map(mapDocumentRow);
}
