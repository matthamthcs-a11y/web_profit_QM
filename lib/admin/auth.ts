import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type AdminProfile = Tables<"admin_profiles">;

export type CurrentAdmin = {
  user: User;
  profile: AdminProfile;
};

const allowedRoles = new Set(["admin", "editor"]);

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id, role, display_name, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || !allowedRoles.has(profile.role)) {
    return null;
  }

  return { user, profile };
}

export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
