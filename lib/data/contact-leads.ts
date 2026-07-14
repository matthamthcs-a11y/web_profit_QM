import { getSupabaseDataClient } from "@/lib/data/source";
import type { TablesInsert } from "@/lib/supabase/database.types";

export type CreateContactLeadInput = {
  name?: string;
  phone: string;
  email?: string;
  message: string;
  source?: string;
  productId?: string;
};

export async function createContactLead(input: CreateContactLeadInput) {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return {
      ok: false,
      error: "Supabase is not configured.",
    };
  }

  const payload: TablesInsert<"contact_leads"> = {
    name: input.name || null,
    phone: input.phone,
    email: input.email || null,
    message: input.message,
    source: input.source || "contact_page",
    product_id: input.productId || null,
    status: "new",
  };

  const { error } = await supabase.from("contact_leads").insert(payload);

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  return { ok: true, error: null };
}
