import { testimonials } from "@/lib/mock-data";
import { mapTestimonialRow } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

export async function getTestimonials() {
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
