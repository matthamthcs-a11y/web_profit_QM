import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
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

      <section className="container-px mx-auto grid max-w-7xl gap-8 py-14 lg:grid-cols-3">
        <DetailBlock
          title={c.detail.benefits}
          items={product.benefits.map((item) => text(item, locale))}
        />
        <DetailBlock
          title={c.detail.usage}
          items={product.usage.map((item) => text(item, locale))}
        />
        <DetailBlock
          title={c.detail.audience}
          items={product.audience.map((item) => text(item, locale))}
        />
      </section>

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

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded border border-line p-6">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item} className="whitespace-pre-line">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
