import type { Metadata } from "next";
import { ProductCatalog } from "@/components/product-catalog";
import { SectionHeading } from "@/components/section-heading";
import { categories, products } from "@/lib/mock-data";
import { copy, getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Products",
  description: "Danh sach san pham Pro-Fitness Sports Nutrition.",
};

export default async function ProductsPage() {
  const locale = await getLocale();
  const c = copy[locale];

  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow="Products"
        title={c.products.title}
        description={c.products.description}
      />
      <ProductCatalog
        locale={locale}
        products={products}
        categories={categories}
        labels={{
          all: c.common.all,
          filters: c.products.filters,
          searchPlaceholder: c.products.searchPlaceholder,
          noResults: c.products.noResults,
          price: c.common.price,
          flavors: c.common.flavors,
          viewDetail: c.common.viewDetail,
          bestSeller: c.common.bestSeller,
        }}
      />
    </section>
  );
}
