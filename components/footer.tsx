import Link from "next/link";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data/site-settings";
import { copy, getLocale } from "@/lib/i18n";

export async function Footer() {
  const [locale, siteSettings] = await Promise.all([
    getLocale(),
    getSiteSettings(),
  ]);
  const c = copy[locale];
  const footerGroups = [
    {
      title: c.nav.products,
      links: [
        [c.nav.products, "/products"],
        [c.nav.certificates, "/certificates"],
        [c.nav.dealers, "/dealers"],
      ],
    },
    {
      title: "Pro-Fitness",
      links: [
        [c.nav.about, "/about"],
        [c.nav.contact, "/contact"],
      ],
    },
  ] as const;

  return (
    <footer className="bg-ink pb-20 text-white md:pb-0">
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            {locale === "vi"
              ? "Catalog sản phẩm dinh dưỡng thể thao, tập trung vào giá bán, hương vị, công dụng, cách sử dụng và tư vấn nhanh qua hotline."
              : "Sports nutrition product catalog focused on prices, flavors, benefits, usage instructions and quick hotline consultation."}
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-red" />
              {siteSettings.hotline}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-red" />
              {siteSettings.email}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-red" />
              {siteSettings.address}
            </span>
            <span className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-brand-red" />
              Facebook / Zalo / Messenger
            </span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm font-black uppercase tracking-wide">
                {group.title}
              </h2>
              <ul className="grid gap-3 text-sm text-slate-300">
                {group.links.map(([label, href]) => (
                  <li key={`${group.title}-${label}-${href}`}>
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
        © 2026 Pro-Fitness Sports Nutrition.
      </div>
    </footer>
  );
}
