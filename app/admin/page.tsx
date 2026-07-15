import type { Metadata } from "next";
import Link from "next/link";
import { logoutAdmin } from "@/app/admin/login/actions";
import { getAdminLinks } from "@/components/admin-nav";
import { AdminPageHeader } from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminDashboardData } from "@/lib/admin/data";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Khu vực quản trị nội dung Pro-Fitness.",
};

const copy = {
  vi: {
    eyebrow: "Admin Dashboard",
    title: "Quản trị Pro-Fitness",
    description: (email: string, role: string) =>
      `Đã đăng nhập bằng ${email}. Quyền hiện tại: ${role}.`,
    logout: "Đăng xuất",
    openModule: (label: string) => `Mở module quản trị ${label.toLowerCase()}.`,
    stats: {
      products: "Sản phẩm",
      categories: "Danh mục",
      brands: "Thương hiệu",
      banners: "Banner",
      documents: "Tài liệu",
      dealers: "Đại lý",
      testimonials: "Phản hồi",
      newLeads: "Lead mới",
    },
  },
  en: {
    eyebrow: "Admin Dashboard",
    title: "Pro-Fitness Admin",
    description: (email: string, role: string) =>
      `Signed in as ${email}. Current role: ${role}.`,
    logout: "Log out",
    openModule: (label: string) => `Open the ${label.toLowerCase()} admin module.`,
    stats: {
      products: "Products",
      categories: "Categories",
      brands: "Brands",
      banners: "Banners",
      documents: "Documents",
      dealers: "Dealers",
      testimonials: "Testimonials",
      newLeads: "New leads",
    },
  },
} as const;

export default async function AdminDashboardPage() {
  const [{ user, profile }, counts, locale] = await Promise.all([
    requireAdmin(),
    getAdminDashboardData(),
    getLocale(),
  ]);
  const t = copy[locale];
  const adminLinks = getAdminLinks(locale);
  const statCards = [
    { label: t.stats.products, value: counts.products },
    { label: t.stats.categories, value: counts.categories },
    { label: t.stats.brands, value: counts.brands },
    { label: t.stats.banners, value: counts.banners },
    { label: t.stats.documents, value: counts.documents },
    { label: t.stats.dealers, value: counts.dealers },
    { label: t.stats.testimonials, value: counts.testimonials },
    { label: t.stats.newLeads, value: counts.newLeads },
  ];

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <AdminPageHeader
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description(user.email ?? "admin", profile.role)}
        />
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="h-11 rounded border border-line px-5 text-sm font-black uppercase text-ink hover:border-brand-red hover:text-brand-red"
          >
            {t.logout}
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
                {t.openModule(item.label)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
