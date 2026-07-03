import Link from "next/link";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

const footerGroups = [
  {
    title: "Products",
    links: [
      ["Energy", "/products?category=energy"],
      ["Hydration", "/products?category=hydration"],
      ["Recovery", "/products?category=recovery"],
      ["Protein", "/products?category=protein"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Knowledge", "/knowledge"],
      ["Catalog PDF", "/knowledge"],
      ["Certificates", "/brands"],
      ["FAQ", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Profitness", "/about"],
      ["Brands", "/brands"],
      ["Dealers", "/dealers"],
      ["Contact", "/contact"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded bg-brand-red text-sm font-black">
              PF
            </span>
            <div>
              <p className="font-black uppercase tracking-wide">Profitness</p>
              <p className="text-sm text-slate-300">Performance Nutrition</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            Catalog dinh dưỡng thể thao chính hãng, tập trung vào tư vấn đúng
            nhu cầu, tài liệu minh bạch và hệ thống đại lý toàn quốc.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-red" />
              0900 000 000
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-red" />
              hello@profitness.vn
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-red" />
              Ho Chi Minh City, Vietnam
            </span>
            <span className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-brand-red" />
              Facebook / Zalo / Messenger
            </span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm font-black uppercase tracking-wide">
                {group.title}
              </h2>
              <ul className="grid gap-3 text-sm text-slate-300">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © 2026 Profitness. Frontend preview for client review.
      </div>
    </footer>
  );
}
