import type { LocalizedText, Locale, ProductBadgeType } from "@/lib/types";

export const productBadgeTypes = [
  "none",
  "best_seller",
  "recommended",
  "new",
  "featured",
] as const satisfies readonly ProductBadgeType[];

export const productBadgeLabels: Record<ProductBadgeType, LocalizedText> = {
  none: {
    vi: "Không có",
    en: "None",
  },
  best_seller: {
    vi: "Bán chạy",
    en: "Best seller",
  },
  recommended: {
    vi: "Khuyên dùng",
    en: "Recommended",
  },
  new: {
    vi: "Mới",
    en: "New",
  },
  featured: {
    vi: "Nổi bật",
    en: "Featured",
  },
};

export function normalizeProductBadgeType(
  value?: FormDataEntryValue | string | null,
): ProductBadgeType {
  return productBadgeTypes.includes(value as ProductBadgeType)
    ? (value as ProductBadgeType)
    : "none";
}

export function getProductBadgeLabel(type: ProductBadgeType, locale: Locale) {
  const label = productBadgeLabels[type] ?? productBadgeLabels.none;

  return label[locale] || label.vi;
}
