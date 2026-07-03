import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories, products } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Products",
  description: "Danh sach san pham dinh duong the thao Profitness.",
};

export default function ProductsPage() {
  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow="Products"
        title="Danh mục sản phẩm"
        description="Bản preview hiển thị cấu trúc catalog, tìm kiếm và bộ lọc giả lập. Bộ lọc thật sẽ được nối Supabase ở giai đoạn sau."
      />

      <div className="mb-8 grid gap-4 rounded border border-line bg-surface p-4 lg:grid-cols-[1fr_auto]">
        <div className="flex min-h-12 items-center gap-3 rounded bg-white px-4">
          <Search className="h-4 w-4 text-muted" />
          <span className="text-sm font-semibold text-muted">
            Tìm theo tên sản phẩm, thương hiệu hoặc mục tiêu sử dụng
          </span>
        </div>
        <div className="flex min-h-12 items-center gap-2 rounded bg-white px-4 text-sm font-black text-ink">
          <SlidersHorizontal className="h-4 w-4 text-brand-red" />
          Bộ lọc preview
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category.id}
            className="rounded border border-line bg-white px-3 py-2 text-sm font-bold text-muted"
          >
            {category.name}
          </span>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
