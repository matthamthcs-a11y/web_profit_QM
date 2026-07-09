import type { Metadata } from "next";
import { Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getLocale, HOTLINE, ZALO_URL } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact",
  description: "Lien he Pro-Fitness Sports Nutrition.",
};

export default async function ContactPage() {
  const locale = await getLocale();

  return (
    <section className="container-px mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[0.8fr_1fr]">
      <div>
        <SectionHeading
          eyebrow="Contact"
          title={locale === "vi" ? "Liên hệ tư vấn" : "Contact for advice"}
          description={
            locale === "vi"
              ? "Khách hàng có thể gọi hotline hoặc nhắn Zalo để được tư vấn sản phẩm và mua hàng trực tiếp."
              : "Customers can call the hotline or message Zalo for product advice and direct purchase."
          }
        />
        <div className="grid gap-4">
          <ContactLine icon={Phone} label="Hotline" value={HOTLINE} />
          <ContactLine icon={Mail} label="Email" value="hello@profitness.vn" />
          <ContactLine icon={MessageCircle} label="Zalo" value="Pro-Fitness" />
          <ContactLine icon={Facebook} label="Facebook" value="Pro-Fitness Vietnam" />
          <ContactLine
            icon={MapPin}
            label={locale === "vi" ? "Văn phòng" : "Office"}
            value="Ho Chi Minh City, Vietnam"
          />
        </div>
      </div>

      <div className="rounded border border-line bg-surface p-6">
        <h2 className="text-2xl font-black text-ink">
          {locale === "vi" ? "Liên hệ nhanh" : "Quick contact"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          {locale === "vi"
            ? "Form lưu dữ liệu sẽ được triển khai sau khi kết nối Supabase. Giai đoạn này ưu tiên nút gọi và Zalo."
            : "Lead form storage will be implemented after Supabase integration. This phase prioritizes call and Zalo buttons."}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={ZALO_URL}
            className="flex h-12 items-center justify-center rounded bg-brand-red text-sm font-black text-white"
          >
            {locale === "vi" ? "Nhắn Zalo" : "Message Zalo"}
          </a>
          <a
            href={`tel:${HOTLINE}`}
            className="flex h-12 items-center justify-center rounded bg-ink text-sm font-black text-white"
          >
            {HOTLINE}
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
