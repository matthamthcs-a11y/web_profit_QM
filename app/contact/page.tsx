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
          <ContactLine icon={Phone} label="Hotline" value={siteSettings.hotline} />
          <ContactLine icon={Mail} label="Email" value={siteSettings.email} />
          <ContactLine icon={MessageCircle} label="Zalo" value="Pro-Fitness" />
          <ContactLine
            icon={Facebook}
            label="Facebook"
            value={siteSettings.facebookLabel}
          />
          <ContactLine
            icon={MapPin}
            label={locale === "vi" ? "Văn phòng" : "Office"}
            value={siteSettings.address}
          />
        </div>
      </div>

      <div className="grid gap-5">
        <ContactLeadForm locale={locale} />
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={siteSettings.zaloUrl}
            className="flex h-12 items-center justify-center rounded bg-brand-red text-sm font-black text-white"
          >
            {locale === "vi" ? "Nhắn Zalo" : "Message Zalo"}
          </a>
          <a
            href={`tel:${siteSettings.hotline}`}
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
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded border border-line p-4">
      <Icon className="h-5 w-5 text-brand-red" />
      <div>
        <p className="text-xs font-black uppercase text-muted">{label}</p>
        <p className="font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}
