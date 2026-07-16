"use client";

import type { Locale, Product } from "@/lib/types";

type ProductVisualProps = {
  product: Product;
  locale: Locale;
  size?: "card" | "hero" | "banner";
  hideLabel?: boolean;
};

export function ProductVisual({
  product,
  locale,
  size = "card",
  hideLabel = false,
}: ProductVisualProps) {
  const isHero = size === "hero";
  const isBanner = size === "banner";
  const shellSize = isHero
    ? "h-[30rem] w-full max-w-[34rem]"
    : isBanner
      ? "h-[24rem] w-full max-w-[30rem]"
      : "h-52 w-full";
  const packageSize = isHero
    ? "h-96 w-64"
    : isBanner
      ? "h-80 w-52"
      : "h-36 w-28";

  return (
    <div
      className={`relative flex ${shellSize} items-center justify-center overflow-hidden rounded bg-surface`}
      style={{ backgroundColor: product.visual.background }}
    >
      {product.imagePath ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imagePath}
            alt={product.name[locale] ?? product.name.vi}
            className="relative z-10 h-full w-full object-contain p-6"
            loading={isHero || isBanner ? "eager" : "lazy"}
          />
        </>
      ) : (
        <>
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20"
        style={{ backgroundColor: product.visual.accent }}
      />
      <div
        className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full opacity-15"
        style={{ backgroundColor: product.visual.accent }}
      />
      {hideLabel ? null : (
      <div className="absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase text-ink shadow-sm">
          {product.visual.badge[locale] ?? product.visual.badge.vi}
        </div>
      )}
      <PackageShape
        product={product}
        locale={locale}
        className={packageSize}
        hideLabel={hideLabel}
      />
        </>
      )}
    </div>
  );
}

function PackageShape({
  product,
  locale,
  className,
  hideLabel = false,
}: {
  product: Product;
  locale: Locale;
  className: string;
  hideLabel?: boolean;
}) {
  const common =
    "relative flex flex-col justify-between border border-black/10 bg-white p-4 shadow-soft";

  if (product.visual.packageType === "tube") {
    return (
      <div
        className={`${className} ${common} rounded-full`}
        style={{ borderColor: product.visual.accent }}
      >
        {hideLabel ? null : <ProductLabel product={product} locale={locale} compact />}
      </div>
    );
  }

  if (product.visual.packageType === "tub") {
    return (
      <div className={`${className} relative flex items-end justify-center`}>
        <div className="absolute top-0 h-10 w-44 rounded-t border border-black/10 bg-slate-900" />
        <div className={`${common} h-64 w-52 rounded-b rounded-t-sm pt-12`}>
          {hideLabel ? null : <ProductLabel product={product} locale={locale} />}
        </div>
      </div>
    );
  }

  if (product.visual.packageType === "pouch") {
    return (
      <div
        className={`${className} ${common} rounded-b-3xl rounded-t-lg`}
        style={{ borderColor: product.visual.accent }}
      >
        <div className="absolute left-5 right-5 top-4 h-2 rounded-full bg-black/10" />
        {hideLabel ? null : <ProductLabel product={product} locale={locale} />}
      </div>
    );
  }

  return (
    <div
      className={`${className} ${common} rounded-b-2xl rounded-t-md`}
      style={{ borderColor: product.visual.accent }}
    >
      {hideLabel ? null : <ProductLabel product={product} locale={locale} />}
    </div>
  );
}

function ProductLabel({
  product,
  locale,
  compact = false,
}: {
  product: Product;
  locale: Locale;
  compact?: boolean;
}) {
  return (
    <>
      <span
        className="text-xs font-black uppercase"
        style={{ color: product.visual.accent }}
      >
        {product.brand}
      </span>
      <span
        className={`${compact ? "text-lg" : "text-2xl"} font-black leading-tight text-ink`}
      >
        {product.name[locale] ?? product.name.vi}
      </span>
      <span className="text-xs font-black uppercase text-muted">
        {product.primaryGoal[locale] ?? product.primaryGoal.vi}
      </span>
    </>
  );
}
