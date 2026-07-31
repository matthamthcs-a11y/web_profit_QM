import type { Metadata } from "next";
import { Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactLeadForm } from "@/components/contact-lead-form";
import { SectionHeading } from "@/components/section-heading";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact",
  description: "Lien he Pro-Fitness Sports Nutrition.",
};

export default async function ContactPage() {
  const [locale, siteSettings] = await Promise.all([
    getLocale(),
    getSiteSettings(),
  ]);
  const phoneHref = `tel:${toPhoneHref(siteSettings.hotline)}`;
  const emailHref = siteSettings.email ? `mailto:${siteSettings.email}` : undefined;
  const zaloHref = siteSettings.zaloUrl || undefined;
  const facebookHref = siteSettings.facebookUrl || undefined;
  const addressHref = siteSettings.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        siteSettings.address,
      )}`
    : undefined;

  return (
    <section className="container-px mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[0.8fr_1fr]">
      <div>
        <SectionHeading
          eyebrow={locale === "vi" ? "Liên hệ" : "Contact"}
          title={locale === "vi" ? "Liên hệ tư vấn" : "Contact for advice"}
          description={
            locale === "vi"
              ? "Khách hàng có thể gửi yêu cầu, gọi hotline hoặc nhắn Zalo để được tư vấn sản phẩm và mua hàng trực tiếp."
              : "Customers can call the hotline or message Zalo for product advice and direct purchase."
          }
        />
        <div className="grid gap-4">
          <ContactLine
            icon={Phone}
            label="Hotline"
            value={siteSettings.hotline}
            href={phoneHref}
            iconClassName="text-emerald-600"
            iconBackgroundClassName="bg-emerald-50"
          />
          <ContactLine
            icon={Mail}
            label="Email"
            value={siteSettings.email}
            href={emailHref}
            iconClassName="text-sky-600"
            iconBackgroundClassName="bg-sky-50"
          />
          <ContactLine
            icon={MessageCircle}
            label="Zalo"
            value={locale === "vi" ? "Nhắn Zalo" : "Message on Zalo"}
            href={zaloHref}
            iconClassName="text-[#0068ff]"
            iconBackgroundClassName="bg-blue-50"
          />
          <ContactLine
            icon={Facebook}
            label="Facebook"
            value={siteSettings.facebookLabel}
            href={facebookHref}
            iconClassName="text-[#1877f2]"
            iconBackgroundClassName="bg-blue-50"
          />
          <ContactLine
            icon={MapPin}
            label={locale === "vi" ? "Văn phòng" : "Office"}
            value={siteSettings.address}
            href={addressHref}
            iconClassName="text-brand-red"
            iconBackgroundClassName="bg-red-50"
          />
        </div>
      </div>

      <div className="grid gap-5">
        <ContactLeadForm locale={locale} />
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={zaloHref}
            target={isExternalHref(zaloHref) ? "_blank" : undefined}
            rel={isExternalHref(zaloHref) ? "noreferrer" : undefined}
            className="flex h-12 items-center justify-center rounded bg-brand-red text-sm font-black text-white"
          >
            {locale === "vi" ? "Nhắn Zalo" : "Message Zalo"}
          </a>
          <a
            href={phoneHref}
            className="flex h-12 items-center justify-center rounded bg-ink text-sm font-black text-white"
          >
            {siteSettings.hotline}
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
  iconClassName,
  iconBackgroundClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  iconClassName: string;
  iconBackgroundClassName: string;
}) {
  const content = (
    <>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBackgroundClassName}`}
      >
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </span>
      <div>
        <p className="text-xs font-black uppercase text-muted">{label}</p>
        <p className="font-bold text-ink">{value}</p>
      </div>
    </>
  );

  const className =
    "flex items-center gap-3 rounded border border-line p-4 transition hover:border-brand-red hover:bg-red-50/40";

  if (!href) {
    return <div className={className}>{content}</div>;
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

function toPhoneHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function isExternalHref(href?: string) {
  return Boolean(href?.startsWith("http://") || href?.startsWith("https://"));
}
