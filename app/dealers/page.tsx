import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { getDealers } from "@/lib/data/dealers";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Dealers",
  description: "He thong dai ly Pro-Fitness Sports Nutrition.",
};

export default async function DealersPage() {
  const locale = await getLocale();
  const dealers = await getDealers();

  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow={locale === "vi" ? "Đại lý" : "Dealers"}
        title={locale === "vi" ? "Thông tin đại lý" : "Dealer information"}
        description={
          locale === "vi"
            ? "Danh sách điểm tư vấn và phân phối sẽ được cập nhật khi khách cung cấp dữ liệu đại lý chính thức."
            : "Consultation and distribution points will be updated when official dealer data is provided."
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        {dealers.map((dealer) => (
          <article key={dealer.id} className="rounded border border-line p-6 flex flex-col items-center justify-center gap-4 text-center bg-white shadow-sm hover:shadow transition-shadow">
            {dealer.logoPath ? (
              <div className="h-24 w-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={dealer.logoPath} 
                  alt={dealer.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xl">
                {dealer.name.charAt(0)}
              </div>
            )}
            <h2 className="text-xl font-black text-ink">{dealer.name}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
