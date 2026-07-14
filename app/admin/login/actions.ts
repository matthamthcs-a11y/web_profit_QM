"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminLoginFormState = {
  message: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

const allowedRoles = new Set(["admin", "editor"]);

export async function loginAdmin(
  previousState: AdminLoginFormState,
  formData: FormData,
): Promise<AdminLoginFormState> {
  void previousState;

  const email = getFormString(formData, "email").toLowerCase();
  const password = getFormString(formData, "password");
  const fieldErrors: AdminLoginFormState["fieldErrors"] = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Vui lòng nhập email admin hợp lệ.";
  }

  if (password.length < 6) {
    fieldErrors.password = "Mật khẩu cần tối thiểu 6 ký tự.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      message: "Vui lòng kiểm tra lại thông tin đăng nhập.",
      fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      message: "Email hoặc mật khẩu không đúng.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id, role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || !allowedRoles.has(profile.role)) {
    await supabase.auth.signOut();

    return {
      message:
        "Tài khoản này chưa có quyền quản trị. Vui lòng thêm user vào bảng admin_profiles.",
    };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();
  redirect("/admin/login");
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}
