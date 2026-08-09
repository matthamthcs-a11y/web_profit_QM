import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { ZaloBrandIcon } from "@/components/brand-social-icons";
import { FooterFacebookMenu } from "@/components/footer-facebook-menu";
import { getSiteSettings } from "@/lib/data/site-settings";
import { copy, getLocale } from "@/lib/i18n";

export async function Footer() {
  const [locale, siteSettings] = await Promise.all([
    getLocale(),
    getSiteSettings(),
  ]);
  const c = copy[locale];
  const phoneHref = `tel:${toPhoneHref(siteSettings.hotline)}`;
  const emailHref = siteSettings.email ? `mailto:${siteSettings.email}` : undefined;
  const addressHref = siteSettings.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        siteSettings.address,
      )}`
    : undefined;
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
            <FooterContactLink
              href={phoneHref}
              icon={Phone}
              iconClassName="text-emerald-400"
            >
              {siteSettings.hotline}
            </FooterContactLink>
            <FooterContactLink
              href={emailHref}
              icon={Mail}
              iconClassName="text-sky-400"
            >
              {siteSettings.email}
            </FooterContactLink>
            <FooterContactLink
              href={addressHref}
              icon={MapPin}
              iconClassName="text-brand-red"
            >
              {siteSettings.address}
            </FooterContactLink>
            <div className="flex items-center gap-2 pt-1">
              <FooterFacebookMenu pages={siteSettings.facebookPages} />
              <SocialIconLink
                href={siteSettings.zaloUrl}
                label="Zalo"
                className="text-white hover:text-brand-red"
              >
                <ZaloBrandIcon className="h-8 w-8" />
              </SocialIconLink>
            </div>
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

function FooterContactLink({
  href,
  icon: Icon,
  iconClassName,
  children,
}: {
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} />
      <span>{children}</span>
    </>
  );
  const className =
    "flex items-start gap-2 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red";

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <a
      href={href}
      target={isExternalHref(href) ? "_blank" : undefined}
      rel={isExternalHref(href) ? "noreferrer" : undefined}
      className={className}
    >
      {content}
    </a>
  );
}

function SocialIconLink({
  href,
  label,
  className,
  children,
}: {
  href?: string;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const baseClassName = `flex h-8 w-8 items-center justify-center bg-transparent transition ${className}`;

  if (!href) {
    return (
      <span aria-label={label} className={`${baseClassName} opacity-40`}>
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={isExternalHref(href) ? "_blank" : undefined}
      rel={isExternalHref(href) ? "noreferrer" : undefined}
      aria-label={label}
      className={baseClassName}
    >
      {children}
    </a>
  );
}

function toPhoneHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function isExternalHref(href?: string) {
  return Boolean(href?.startsWith("http://") || href?.startsWith("https://"));
}
