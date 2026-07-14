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

export const adminLinks = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: Tags },
  { href: "/admin/brands", label: "Thương hiệu", icon: Tags },
  { href: "/admin/banners", label: "Banner", icon: ImageIcon },
  { href: "/admin/documents", label: "Tài liệu", icon: FileText },
  { href: "/admin/dealers", label: "Đại lý", icon: MapPin },
  { href: "/admin/testimonials", label: "Phản hồi", icon: Star },
  { href: "/admin/leads", label: "Lead", icon: MessageSquare },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export function AdminNav() {
  return (
    <nav className="container-px mx-auto flex max-w-7xl gap-2 overflow-x-auto border-b border-line py-3">
      {adminLinks.map((item) => {
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
