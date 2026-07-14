import type { Metadata } from "next";
import Link from "next/link";
import { logoutAdmin } from "@/app/admin/login/actions";
import { adminLinks } from "@/components/admin-nav";
import { AdminPageHeader } from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminDashboardData } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Khu vuc quan tri noi dung Pro-Fitness.",
};

export default async function AdminDashboardPage() {
  const [{ user, profile }, counts] = await Promise.all([
    requireAdmin(),
    getAdminDashboardData(),
  ]);
  const statCards = [
    { label: "Sản phẩm", value: counts.products },
    { label: "Danh mục", value: counts.categories },
    { label: "Thương hiệu", value: counts.brands },
    { label: "Banner", value: counts.banners },
    { label: "Tài liệu", value: counts.documents },
    { label: "Đại lý", value: counts.dealers },
    { label: "Phản hồi", value: counts.testimonials },
    { label: "Lead mới", value: counts.newLeads },
  ];

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <AdminPageHeader
          eyebrow="Admin Dashboard"
          title="Quản trị Pro-Fitness"
          description={`Đã đăng nhập bằng ${user.email ?? "admin"}. Quyền hiện tại: ${profile.role}.`}
        />
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="h-11 rounded border border-line px-5 text-sm font-black uppercase text-ink hover:border-brand-red hover:text-brand-red"
          >
            Đăng xuất
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <article key={card.label} className="rounded border border-line p-5">
            <p className="text-sm font-bold text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-black text-ink">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminLinks.slice(1).map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded border border-line bg-white p-5 shadow-sm hover:border-brand-red"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded bg-surface text-brand-red">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-black text-ink">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Mở module quản trị {item.label.toLowerCase()}.
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
