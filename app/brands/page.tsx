import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { brands, documents } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Brands",
  description: "Thuong hieu Profitness phan phoi va tai lieu chung nhan.",
};

export default function BrandsPage() {
  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow="Brands"
        title="Thương hiệu phân phối"
        description="Trang này giúp tăng độ tin cậy bằng cách gom thông tin thương hiệu, xuất xứ và giấy tờ sản phẩm."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {brands.map((brand) => (
          <article key={brand.id} className="rounded border border-line p-6">
            <p className="text-xs font-black uppercase text-brand-red">
              {brand.origin}
            </p>
            <h2 className="mt-3 text-2xl font-black text-ink">{brand.name}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {brand.description}
            </p>
            <p className="mt-5 text-sm font-bold text-ink">
              {brand.documentCount} tài liệu xác thực
            </p>
          </article>
        ))}
      </div>
      <div className="mt-12 rounded border border-line bg-surface p-6">
        <h2 className="text-2xl font-black text-ink">Download tài liệu</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {documents.map((document) => (
            <article key={document.id} className="rounded bg-white p-5">
              <p className="text-xs font-black uppercase text-brand-red">
                {document.type}
              </p>
              <h3 className="mt-2 font-black text-ink">{document.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {document.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
