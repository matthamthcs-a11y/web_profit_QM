import { unstable_cache } from "next/cache";
import { testimonials } from "@/lib/mock-data";
import { mapTestimonialRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

const getTestimonialsCached = unstable_cache(
  async () => getTestimonialsUncached(),
  ["profitness-testimonials"],
  { revalidate: 300, tags: ["testimonials"] },
);

export async function getTestimonials() {
  return getTestimonialsCached();
}

async function getTestimonialsUncached() {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return testimonials;
  }

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return testimonials;
  }

  return data.map(mapTestimonialRow);
}
