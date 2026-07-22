"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { getProductBadgeLabel } from "@/lib/product-badges";
import type { Category, Locale, Product } from "@/lib/types";

type ProductCatalogProps = {
  locale: Locale;
  products: Product[];
  categories: Category[];
  labels: {
    all: string;
    filters: string;
    searchPlaceholder: string;
    noResults: string;
    price: string;
    flavors: string;
    viewDetail: string;
    bestSeller: string;
  };
};

function t(value: { vi: string; en: string }, locale: Locale) {
  return value[locale] || value.vi;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function fuzzyIncludes(source: string, query: string) {
  if (!query) return true;
  if (source.includes(query)) return true;
  const words = source.split(/\s+/);
  return words.some((word) => levenshtein(word, query) <= 1);
}

function levenshtein(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return 99;
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
    }
  }

  return dp[a.length][b.length];
}

export function ProductCatalog({
  locale,
  products,
  categories,
  labels,
}: ProductCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");

  const brands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brand))),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query);

    return products.filter((product) => {
      const haystack = normalize(
        [
          t(product.name, locale),
          product.brand,
          t(product.categoryName, locale),
          t(product.shortDescription, locale),
          ...product.flavors.map((flavor) => t(flavor, locale)),
          ...product.benefits.map((benefit) => t(benefit, locale)),
        ].join(" "),
      );

      return (
        (category === "all" || product.categoryId === category) &&
        (brand === "all" || product.brand === brand) &&
        fuzzyIncludes(haystack, normalizedQuery)
      );
    });
  }, [brand, category, locale, products, query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside className="rounded border border-line bg-surface p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-black text-ink">
          <SlidersHorizontal className="h-4 w-4 text-brand-red" />
          {labels.filters}
        </div>
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-muted">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 rounded border border-line bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-red"
            >
              <option value="all">{labels.all}</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.name, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-muted">Brand</span>
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="h-11 rounded border border-line bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-red"
            >
              <option value="all">{labels.all}</option>
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </aside>

      <div>
        <div className="mb-6 flex min-h-12 items-center gap-3 rounded border border-line bg-white px-4 shadow-sm">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="h-12 min-w-0 flex-1 text-sm font-semibold text-ink outline-none placeholder:text-muted"
          />
        </div>

        {filteredProducts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductResultCard
                key={product.id}
                product={product}
                locale={locale}
                labels={labels}
              />
            ))}
          </div>
        ) : (
          <div className="rounded border border-line bg-surface p-8 text-center text-sm font-bold text-muted">
            {labels.noResults}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductResultCard({
  product,
  locale,
  labels,
}: {
  product: Product;
  locale: Locale;
  labels: ProductCatalogProps["labels"];
}) {
  const badgeLabel =
    product.badgeType === "none"
      ? ""
      : getProductBadgeLabel(product.badgeType, locale);

  return (
    <article className="overflow-hidden rounded border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/products/${product.slug}`}>
        <div className="relative">
          <ProductVisual product={product} locale={locale} />
          {badgeLabel ? (
            <div
              className="pointer-events-none absolute right-4 top-4 z-30 max-w-[calc(100%-2rem)] rounded-full px-3 py-1 text-center text-[11px] font-black uppercase leading-4 text-white shadow-sm ring-2 ring-white"
              style={{ backgroundColor: product.visual.accent }}
            >
              {badgeLabel}
            </div>
          ) : null}
        </div>
        <div className="p-5">
          <p className="text-xs font-black uppercase text-brand-red">
            {t(product.categoryName, locale)}
          </p>
          <h2 className="mt-2 text-lg font-black text-ink">
            {t(product.name, locale)}
          </h2>
          <p className="mt-2 text-2xl font-black text-brand-red">
            {formatPrice(product.price)}
          </p>
          <p className="mt-3 line-clamp-1 text-xs font-semibold text-muted">
            {labels.flavors}:{" "}
            {product.flavors.map((flavor) => t(flavor, locale)).join(", ")}
          </p>
          <p className="mt-3 line-clamp-2 whitespace-pre-line text-sm leading-6 text-muted">
            {t(product.shortDescription, locale)}
          </p>
          <span className="mt-5 inline-flex text-sm font-black text-brand-red">
            {labels.viewDetail}
          </span>
        </div>
      </Link>
    </article>
  );
}
