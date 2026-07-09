import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { dealers } from "@/lib/mock-data";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Dealers",
  description: "He thong dai ly Pro-Fitness Sports Nutrition.",
};

export default async function DealersPage() {
  const locale = await getLocale();

  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow="Dealers"
        title={locale === "vi" ? "Thông tin đại lý" : "Dealer information"}
        description={
          locale === "vi"
            ? "Danh sách điểm tư vấn/phân phối sẽ được cập nhật khi khách cung cấp dữ liệu đại lý chính thức."
            : "Consultation and distribution points will be updated when official dealer data is provided."
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        {dealers.map((dealer) => (
          <article key={dealer.id} className="rounded border border-line p-6">
            <h2 className="text-2xl font-black text-ink">{dealer.name}</h2>
            <p className="mt-2 text-sm font-bold uppercase text-brand-red">
              {dealer.city}
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4 text-brand-red" />
              {dealer.address}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Phone className="h-4 w-4 text-brand-red" />
              {dealer.phone}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
