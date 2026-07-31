import type { Metadata } from "next";
import { ProductCatalog } from "@/components/product-catalog";
import { SectionHeading } from "@/components/section-heading";
import { getCategories } from "@/lib/data/categories";
import { getProductCards } from "@/lib/data/products";
import { copy, getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Products",
  description: "Danh sách sản phẩm Pro-Fitness Sports Nutrition.",
};

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const locale = await getLocale();
  const c = copy[locale];
  const params = await searchParams;
  const initialCategory =
    typeof params?.category === "string" ? params.category : params?.category?.[0];
  const [categories, products] = await Promise.all([
    getCategories(),
    getProductCards(),
  ]);

  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow={locale === "vi" ? "Sản phẩm" : "Products"}
        title={c.products.title}
        description={c.products.description}
      />
      <ProductCatalog
        locale={locale}
        products={products}
        categories={categories}
        initialCategory={initialCategory}
        labels={{
          all: c.common.all,
          filters: c.products.filters,
          searchPlaceholder: c.products.searchPlaceholder,
          noResults: c.products.noResults,
          price: c.common.price,
          flavors: c.common.flavors,
          viewDetail: c.common.viewDetail,
          bestSeller: c.common.bestSeller,
          category: c.common.category,
          brand: c.common.brand,
        }}
      />
    </section>
  );
}
