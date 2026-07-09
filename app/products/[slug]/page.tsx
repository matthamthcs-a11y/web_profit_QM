import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import {
  copy,
  formatPrice,
  getLocale,
  HOTLINE,
  text,
  ZALO_URL,
} from "@/lib/i18n";
import { getProductBySlug, products } from "@/lib/mock-data";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name.vi,
    description: product.shortDescription.vi,
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const locale = await getLocale();
  const c = copy[locale];
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter((item) =>
    product.relatedProductIds.includes(item.id),
  );

  return (
    <article>
      <section className="bg-surface">
        <div className="container-px mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[0.85fr_1fr]">
          <div className="rounded border border-line bg-white p-5 shadow-sm">
            <ProductVisual product={product} locale={locale} size="hero" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-red">
              {text(product.categoryName, locale)}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-ink md:text-6xl">
              {text(product.name, locale)}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted">
              {text(product.shortDescription, locale)}
            </p>
            <p className="mt-6 text-4xl font-black text-brand-red">
              {formatPrice(product.price)}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Info label={c.common.brand} value={product.brand} />
              <Info label={c.common.origin} value={product.origin} />
              <Info label={c.common.size} value={product.sizes.join(", ")} />
              <Info
                label={c.common.flavors}
                value={product.flavors
                  .map((flavor) => text(flavor, locale))
                  .join(", ")}
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={ZALO_URL}
                className="inline-flex h-12 items-center gap-2 rounded bg-brand-red px-5 text-sm font-black text-white hover:bg-red-700"
              >
                <MessageCircle className="h-4 w-4" />
                {c.common.messageZalo}
              </a>
              <a
                href={`tel:${HOTLINE}`}
                className="inline-flex h-12 items-center gap-2 rounded bg-ink px-5 text-sm font-black text-white hover:bg-slate-800"
              >
                <Phone className="h-4 w-4" />
                {HOTLINE}
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-green" />
                {locale === "vi"
                  ? "Thông tin sản phẩm rõ ràng"
                  : "Clear product information"}
              </span>
            </div>
          </div>
        </div>
      </section>

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

      <section className="container-px mx-auto grid max-w-7xl gap-8 pb-14 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded border border-line p-6">
          <h2 className="text-2xl font-black text-ink">{c.detail.ingredients}</h2>
          <div className="mt-5 grid gap-3">
            {product.ingredients.map((ingredient) => (
              <div
                key={ingredient.name}
                className="flex items-center justify-between border-b border-line pb-3 text-sm"
              >
                <span className="font-bold text-ink">{ingredient.name}</span>
                <span className="text-muted">{ingredient.amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded border border-line bg-surface p-6">
          <h2 className="text-2xl font-black text-ink">
            {c.detail.nutritionFacts}
          </h2>
          <div className="mt-5 flex aspect-[4/3] items-center justify-center rounded border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-bold text-muted">
            {locale === "vi"
              ? "Ảnh Nutrition Facts sẽ được upload trong admin sau."
              : "Nutrition Facts image will be uploaded in admin later."}
          </div>
        </div>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-white p-4">
      <p className="text-xs font-black uppercase text-muted">{label}</p>
      <p className="mt-2 font-bold text-ink">{value}</p>
    </div>
  );
}

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded border border-line p-6">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
