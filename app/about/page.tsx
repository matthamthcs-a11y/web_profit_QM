import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description: "Gioi thieu Pro-Fitness Sports Nutrition.",
};

export default async function AboutPage() {
  const locale = await getLocale();

  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow="About"
        title="Pro-Fitness Sports Nutrition"
        description={
          locale === "vi"
            ? "Trang giới thiệu ngắn gọn về định hướng sản phẩm, phân phối và tư vấn dinh dưỡng thể thao."
            : "A concise introduction to the product direction, distribution and sports nutrition consultation."
        }
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded border border-line p-8">
          <h2 className="text-2xl font-black text-ink">
            {locale === "vi" ? "Định hướng" : "Direction"}
          </h2>
          <p className="mt-4 leading-8 text-muted">
            {locale === "vi"
              ? "Pro-Fitness tập trung vào nhóm sản phẩm dinh dưỡng thể thao chính hãng, giúp khách hàng tham khảo nhanh giá bán, hương vị, công dụng và cách sử dụng trước khi liên hệ đội ngũ tư vấn."
              : "Pro-Fitness focuses on official sports nutrition products, helping customers quickly review prices, flavors, benefits and usage instructions before contacting the sales team."}
          </p>
          <p className="mt-4 leading-8 text-muted">
            {locale === "vi"
              ? "Website không xử lý đặt hàng online trong giai đoạn này. Vai trò chính là catalog sản phẩm và cổng liên hệ nhanh."
              : "The website does not handle online checkout at this stage. Its main role is a product catalog and quick contact channel."}
          </p>
        </div>
        <div className="rounded bg-surface p-8">
          <h2 className="text-2xl font-black text-ink">
            {locale === "vi" ? "Thông tin nổi bật" : "Highlights"}
          </h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
            {(locale === "vi"
              ? [
                  "Sản phẩm theo danh mục rõ ràng",
                  "Giá bán luôn hiển thị",
                  "Hương vị và quy cách dễ xem",
                  "Cách sử dụng đặt ngay trong trang sản phẩm",
                  "Hotline cố định để tư vấn nhanh",
                ]
              : [
                  "Clear product categories",
                  "Prices are always visible",
                  "Flavors and sizes are easy to scan",
                  "Usage instructions are shown on product pages",
                  "Fixed hotline for quick consultation",
                ]
            ).map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
