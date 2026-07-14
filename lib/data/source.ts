import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export function getSupabaseDataClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  return createSupabasePublicClient();
}
