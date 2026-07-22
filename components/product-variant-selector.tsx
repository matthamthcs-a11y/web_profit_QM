"use client";

import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductInformationSection } from "@/components/product-information-section";
import { ProductVisual } from "@/components/product-visual";
import { buildOptionKey, getDefaultVariant } from "@/lib/product-variants";
import type { SiteSettings } from "@/lib/data/site-settings";
import type { Locale, LocalizedText, Product } from "@/lib/types";

type ProductVariantSelectorProps = {
  product: Product;
  locale: Locale;
  siteSettings: SiteSettings;
  informationBlocks: Array<{
    title: string;
    items: string[];
  }>;
};

const detailCopy = {
  vi: {
    flavor: "Hương vị",
    size: "Quy cách",
    brand: "Thương hiệu",
    origin: "Xuất xứ",
    messageZalo: "Nhắn Zalo",
    clearInfo: "Thông tin sản phẩm rõ ràng",
    readMore: "Xem thêm",
    readLess: "Thu gọn",
  },
  en: {
    flavor: "Flavor",
    size: "Size",
    brand: "Brand",
    origin: "Origin",
    messageZalo: "Message Zalo",
    clearInfo: "Clear product information",
    readMore: "Read more",
    readLess: "Collapse",
  },
} satisfies Record<Locale, Record<string, string>>;

export function ProductVariantSelector({
  product,
  locale,
  siteSettings,
  informationBlocks,
}: ProductVariantSelectorProps) {
  const c = detailCopy[locale];
  const variants = useMemo(
    () =>
      product.variants
        .filter((variant) => variant.isPublished)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [product.variants],
  );
  const defaultVariant = getDefaultVariant(product);
  const [selectedFlavorKey, setSelectedFlavorKey] = useState(
    defaultVariant?.flavorKey ?? "",
  );
  const [selectedSizeKey, setSelectedSizeKey] = useState(
    defaultVariant?.sizeKey ?? "",
  );

  const currentVariant =
    variants.find(
      (variant) =>
        variant.flavorKey === selectedFlavorKey &&
        variant.sizeKey === selectedSizeKey,
    ) ??
    defaultVariant ??
    variants[0] ??
    null;
  const flavorOptions = getUniqueOptions(
    variants.map((variant) => ({
      key: variant.flavorKey,
      label: localized(variant.flavor, locale),
    })),
  );
  const sizeOptions = getUniqueOptions(
    variants.map((variant) => ({
      key: variant.sizeKey,
      label: localized(variant.size, locale),
    })),
  );
  const productForImage: Product = {
    ...product,
    imagePath: currentVariant?.imagePath || product.imagePath,
  };
  const nutritionImagePath =
    currentVariant?.nutritionImagePath || product.nutritionImagePath || null;
  const price = currentVariant?.price ?? product.price;
  const shortDescription = localized(product.shortDescription, locale);

  function selectFlavor(flavorKey: string) {
    const currentSizeStillExists = variants.some(
      (variant) =>
        variant.flavorKey === flavorKey && variant.sizeKey === selectedSizeKey,
    );
    const firstVariant = variants.find((variant) => variant.flavorKey === flavorKey);

    setSelectedFlavorKey(flavorKey);
    if (!currentSizeStillExists && firstVariant) {
      setSelectedSizeKey(firstVariant.sizeKey);
    }
  }

  function selectSize(sizeKey: string) {
    const currentFlavorStillExists = variants.some(
      (variant) =>
        variant.sizeKey === sizeKey && variant.flavorKey === selectedFlavorKey,
    );
    const firstVariant = variants.find((variant) => variant.sizeKey === sizeKey);

    setSelectedSizeKey(sizeKey);
    if (!currentFlavorStillExists && firstVariant) {
      setSelectedFlavorKey(firstVariant.flavorKey);
    }
  }

  return (
    <>
      <section className="bg-surface">
        <div className="container-px mx-auto grid max-w-7xl items-start gap-10 py-14 lg:grid-cols-[0.85fr_1fr]">
          <div className="grid gap-5 self-start">
            <div className="rounded border border-line bg-white p-5 shadow-sm">
              <ProductVisual product={productForImage} locale={locale} size="hero" />
            </div>
            {shortDescription ? (
              <DescriptionPanel
                text={shortDescription}
                readMoreLabel={c.readMore}
                readLessLabel={c.readLess}
              />
            ) : null}
          </div>
          <div className="self-start">
            <p className="text-sm font-black uppercase tracking-wide text-brand-red">
              {localized(product.categoryName, locale)}
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-normal text-ink md:text-4xl md:leading-tight">
              {localized(product.name, locale)}
            </h1>
            <p className="mt-5 text-4xl font-black text-brand-red">
              {formatPrice(price)}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info label={c.brand} value={product.brand} />
              <Info label={c.origin} value={product.origin} />
            </div>

            {variants.length ? (
              <div className="mt-6 grid gap-5">
                <OptionGroup
                  label={c.flavor}
                  options={flavorOptions}
                  selectedKey={currentVariant?.flavorKey ?? selectedFlavorKey}
                  onSelect={selectFlavor}
                />
                <OptionGroup
                  label={c.size}
                  options={sizeOptions.map((option) => ({
                    ...option,
                    disabled: !variants.some(
                      (variant) =>
                        variant.flavorKey === selectedFlavorKey &&
                        variant.sizeKey === option.key,
                    ),
                  }))}
                  selectedKey={currentVariant?.sizeKey ?? selectedSizeKey}
                  onSelect={selectSize}
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Info label={c.size} value={product.sizes.join(", ")} />
                <Info
                  label={c.flavor}
                  value={product.flavors
                    .map((flavor) => localized(flavor, locale))
                    .join(", ")}
                />
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={siteSettings.zaloUrl}
                className="inline-flex h-12 items-center gap-2 rounded bg-brand-red px-5 text-sm font-black text-white hover:bg-red-700"
              >
                <MessageCircle className="h-4 w-4" />
                {c.messageZalo}
              </a>
              <a
                href={`tel:${siteSettings.hotline}`}
                className="inline-flex h-12 items-center gap-2 rounded bg-ink px-5 text-sm font-black text-white hover:bg-slate-800"
              >
                <Phone className="h-4 w-4" />
                {siteSettings.hotline}
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-green" />
                {c.clearInfo}
              </span>
            </div>
          </div>
        </div>
      </section>

      <ProductInformationSection
        locale={locale}
        nutritionImagePath={nutritionImagePath}
        blocks={informationBlocks}
      />
    </>
  );
}

function OptionGroup({
  label,
  options,
  selectedKey,
  onSelect,
}: {
  label: string;
  options: Array<{ key: string; label: string; disabled?: boolean }>;
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedKey === option.key;

          return (
            <button
              key={option.key}
              type="button"
              disabled={option.disabled}
              aria-pressed={isSelected}
              onClick={() => onSelect(option.key)}
              className={`min-h-11 rounded border px-4 py-2 text-sm font-black transition ${
                isSelected
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-line bg-white text-ink hover:border-brand-red hover:text-brand-red"
              } disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DescriptionPanel({
  text,
  readMoreLabel,
  readLessLabel,
}: {
  text: string;
  readMoreLabel: string;
  readLessLabel: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongContent = text.length > 260 || text.split(/\r?\n/).length > 5;

  return (
    <div className="rounded border border-line bg-white p-5 shadow-sm">
      <div
        className={`whitespace-pre-line pr-2 text-sm leading-7 text-muted ${
          hasLongContent
            ? isExpanded
              ? "max-h-96 overflow-y-auto"
              : "max-h-44 overflow-hidden"
            : ""
        }`}
      >
        {text}
      </div>
      {hasLongContent ? (
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          className="mt-3 text-sm font-black text-brand-red hover:text-red-700"
        >
          {isExpanded ? readLessLabel : readMoreLabel}
        </button>
      ) : null}
    </div>
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

function getUniqueOptions(options: Array<{ key: string; label: string }>) {
  const seen = new Set<string>();

  return options.filter((option) => {
    const key = option.key || buildOptionKey(option.label);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function localized(value: LocalizedText, locale: Locale) {
  return value[locale] || value.vi || value.en;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}
