import type { LocalizedText, Product, ProductVariant } from "@/lib/types";

export function buildVariantKey(flavor: LocalizedText, size: LocalizedText | string) {
  const flavorLabel = flavor.vi || flavor.en || "flavor";
  const sizeLabel =
    typeof size === "string" ? size : size.vi || size.en || "size";

  return slugPart(`${flavorLabel}-${sizeLabel}`) || "variant";
}

export function buildOptionKey(value: string) {
  return slugPart(value) || "option";
}

export function getPublishedVariants(product: Product) {
  return product.variants.filter((variant) => variant.isPublished);
}

export function getDefaultVariant(product: Product): ProductVariant | null {
  const variants = getPublishedVariants(product);

  return (
    variants.find((variant) => variant.isDefault) ??
    variants.sort((a, b) => a.sortOrder - b.sortOrder)[0] ??
    null
  );
}

function slugPart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
