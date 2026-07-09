import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { copy, formatPrice, text } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  locale: Locale;
};

export function ProductCard({ product, locale }: ProductCardProps) {
  const c = copy[locale];

  return (
    <article className="group overflow-hidden rounded border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <ProductVisual product={product} locale={locale} />
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded bg-red-50 px-2.5 py-1 text-xs font-bold text-brand-red">
              {text(product.categoryName, locale)}
            </span>
            {product.isBestSeller ? (
              <span className="text-xs font-black uppercase text-brand-gold">
                {c.common.bestSeller}
              </span>
            ) : null}
          </div>
          <h3 className="text-lg font-black text-ink">
            {text(product.name, locale)}
          </h3>
          <p className="mt-2 text-2xl font-black text-brand-red">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {text(product.shortDescription, locale)}
          </p>
          <p className="mt-3 line-clamp-1 text-xs font-semibold text-muted">
            {c.common.flavors}:{" "}
            {product.flavors.map((flavor) => text(flavor, locale)).join(", ")}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-red">
            {c.common.viewDetail}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
