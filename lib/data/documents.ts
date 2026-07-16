import { unstable_cache } from "next/cache";
import { documents } from "@/lib/mock-data";
import { mapDocumentRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

const getDocumentsCached = unstable_cache(
  async () => getDocumentsUncached(),
  ["profitness-documents"],
  { revalidate: 300, tags: ["documents"] },
);

export async function getDocuments() {
  return getDocumentsCached();
}

async function getDocumentsUncached() {
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
