import type { Json } from "@/lib/supabase/database.types";
import type { LocalizedText, Locale, ProductBadgeType } from "@/lib/types";

export const legacyProductBadgeLabels: Record<
  Exclude<ProductBadgeType, "none">,
  LocalizedText
> = {
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

export const legacyProductBadgeTypes = [
  "best_seller",
  "recommended",
  "new",
  "featured",
] as const satisfies readonly Exclude<ProductBadgeType, "none">[];

export function normalizeProductBadgeType(
  value?: FormDataEntryValue | string | null,
): ProductBadgeType {
  return value === "best_seller" ||
    value === "recommended" ||
    value === "new" ||
    value === "featured"
    ? value
    : "none";
}

export function getLocalizedBadgeLabel(label: LocalizedText, locale: Locale) {
  return label[locale] || label.vi || label.en;
}

export function normalizeBadgeLabel(value: Json | null): LocalizedText {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const vi = typeof value.vi === "string" ? value.vi : "";
    const en = typeof value.en === "string" ? value.en : vi;

    return { vi, en };
  }

  return { vi: "", en: "" };
}

export function isBestSellerBadgeLabel(label: LocalizedText) {
  const vi = normalizeForCompare(label.vi);
  const en = normalizeForCompare(label.en);

  return vi === "ban chay" || en === "best seller";
}

export function getLegacyBadgeLabel(type: ProductBadgeType) {
  return type === "none" ? null : legacyProductBadgeLabels[type];
}

function normalizeForCompare(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
