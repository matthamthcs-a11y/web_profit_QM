import Link from "next/link";
import {
  FileText,
  ImageIcon,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Package,
  Settings,
  Star,
  Tags,
} from "lucide-react";
import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const adminNavCopy = {
  vi: {
    overview: "Tổng quan",
    products: "Sản phẩm",
    categories: "Danh mục",
    brands: "Thương hiệu",
    banners: "Banner",
    documents: "Tài liệu",
    dealers: "Đại lý",
    testimonials: "Phản hồi",
    leads: "Lead",
    settings: "Cài đặt",
  },
  en: {
    overview: "Overview",
    products: "Products",
    categories: "Categories",
    brands: "Brands",
    banners: "Banners",
    documents: "Documents",
    dealers: "Dealers",
    testimonials: "Testimonials",
    leads: "Leads",
    settings: "Settings",
  },
} as const;

export function getAdminLinks(locale: Locale) {
  const t = adminNavCopy[locale];

  return [
    { href: "/admin", label: t.overview, icon: LayoutDashboard },
    { href: "/admin/products", label: t.products, icon: Package },
    { href: "/admin/categories", label: t.categories, icon: Tags },
    { href: "/admin/brands", label: t.brands, icon: Tags },
    { href: "/admin/banners", label: t.banners, icon: ImageIcon },
    { href: "/admin/documents", label: t.documents, icon: FileText },
    { href: "/admin/dealers", label: t.dealers, icon: MapPin },
    { href: "/admin/testimonials", label: t.testimonials, icon: Star },
    { href: "/admin/leads", label: t.leads, icon: MessageSquare },
    { href: "/admin/settings", label: t.settings, icon: Settings },
  ];
}

export async function AdminNav() {
  const locale = await getLocale();
  const links = getAdminLinks(locale);

  return (
    <nav className="container-px mx-auto flex max-w-7xl gap-2 overflow-x-auto border-b border-line py-3">
      {links.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded border border-line bg-white px-3 text-sm font-black text-ink hover:border-brand-red hover:text-brand-red"
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
