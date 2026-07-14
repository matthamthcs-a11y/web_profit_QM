import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Dang nhap khu vuc quan tri Pro-Fitness.",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <section className="container-px mx-auto max-w-xl py-16">
      <div className="rounded border border-line bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-red">
          Pro-Fitness Admin
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink">
          Đăng nhập quản trị
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Chỉ tài khoản Supabase Auth đã được thêm vào bảng{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
            admin_profiles
          </code>{" "}
          mới có quyền vào khu vực này.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
