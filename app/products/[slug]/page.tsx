import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductInformationSection } from "@/components/product-information-section";
import { ProductVariantSelector } from "@/components/product-variant-selector";
import { copy, getLocale, text } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/data/site-settings";
import {
  getProductBySlug,
  getProductCards,
  getRelatedProducts,
} from "@/lib/data/products";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name.vi,
    description: product.shortDescription.vi,
    openGraph: product.imagePath
      ? {
          images: [{ url: product.imagePath }],
        }
      : undefined,
  };
}

export async function generateStaticParams() {
  const products = await getProductCards();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const [locale, siteSettings] = await Promise.all([
    getLocale(),
    getSiteSettings(),
  ]);
  const c = copy[locale];
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.relatedProductIds);

  return (
    <article>
      <ProductVariantSelector
        product={product}
        locale={locale}
        siteSettings={siteSettings}
      />

      <ProductInformationSection
        locale={locale}
        nutritionImagePath={product.nutritionImagePath ?? null}
        blocks={[
          {
            title: c.detail.benefits,
            items: product.benefits.map((item) => text(item, locale)),
          },
          {
            title: c.detail.usage,
            items: product.usage.map((item) => text(item, locale)),
          },
          {
            title: c.detail.audience,
            items: product.audience.map((item) => text(item, locale)),
          },
        ]}
      />

      {relatedProducts.length ? (
        <section className="bg-surface py-14">
          <div className="container-px mx-auto max-w-7xl">
            <h2 className="mb-6 text-3xl font-black text-ink">
              {c.detail.related}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  product={related}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
