import type {
  Brand,
  Category,
  Dealer,
  DocumentAsset,
  HomeBanner,
  LocalizedText,
  Product,
  ProductBadge,
  ProductVariant,
  Testimonial,
} from "@/lib/types";
import type { Json, Tables } from "@/lib/supabase/database.types";
import type { SiteSettings } from "@/lib/data/site-settings";
import {
  getLegacyBadgeLabel,
  normalizeBadgeLabel,
  normalizeProductBadgeType,
} from "@/lib/product-badges";
import { buildOptionKey, buildVariantKey } from "@/lib/product-variants";

type ProductRow = Tables<"products">;
type CategoryRow = Tables<"categories">;
type BrandRow = Tables<"brands">;
type ProductSizeRow = Tables<"product_sizes">;
type ProductFlavorRow = Tables<"product_flavors">;
type ProductBadgeRow = Tables<"product_badges">;
type ProductContentRow =
  | Tables<"product_benefits">
  | Tables<"product_usage">
  | Tables<"product_audiences">;
type ProductIngredientRow = Tables<"product_ingredients">;
type ProductVariantRow = Tables<"product_variants">;
type RelatedProductRow = Tables<"related_products">;
type DocumentRow = Tables<"documents">;
type HomeBannerRow = Tables<"home_banners">;
type DealerRow = Tables<"dealers">;
type TestimonialRow = Tables<"testimonials">;
type SiteSettingRow = Tables<"site_settings">;

export const defaultSiteSettings: SiteSettings = {
  hotline: "02838481014",
  email: "hello@profitness.vn",
  zaloUrl: "tel:02838481014",
  facebookPages: [
    {
      label: "Pro-Fitness Vietnam",
      url: "",
    },
  ],
  address: "Ho Chi Minh City, Vietnam",
  logoPath: "/logo.webp",
};

export function localizedText(value: Json | null, fallback = ""): LocalizedText {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const vi = typeof value.vi === "string" ? value.vi : fallback;
    const en = typeof value.en === "string" ? value.en : vi || fallback;

    return { vi, en };
  }

  return { vi: fallback, en: fallback };
}

function localizedContentText(value: Json | null): LocalizedText {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      vi: typeof value.vi === "string" ? value.vi : "",
      en: typeof value.en === "string" ? value.en : "",
    };
  }

  return { vi: "", en: "" };
}

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: localizedText(row.name),
    description: localizedText(row.description),
  };
}

export function mapBrandRow(row: BrandRow): Brand {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    origin: row.origin ?? "",
    description: localizedText(row.description),
    documentCount: 0,
    logoPath: row.logo_path,
  };
}

export function mapDocumentRow(row: DocumentRow): DocumentAsset {
  return {
    id: row.id,
    title: localizedText(row.title),
    type: row.type as DocumentAsset["type"],
    description: localizedText(row.description),
    filePath: row.file_path,
    thumbnailPath: row.thumbnail_path,
  };
}

export function mapHomeBannerRow(row: HomeBannerRow): HomeBanner {
  return {
    id: row.id,
    imagePath: row.image_path,
    mobileImagePath: row.mobile_image_path,
    alt: localizedText(row.alt, "Pro-Fitness Sports Nutrition"),
    linkUrl: row.link_url,
  };
}

export function mapDealerRow(row: DealerRow): Dealer {
  return {
    id: row.id,
    name: row.name,
    city: row.city ?? "",
    address: row.address ?? "",
    phone: row.phone ?? "",
  };
}

export function mapTestimonialRow(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? "",
    rating: row.rating,
    quote: localizedText(row.quote),
  };
}

export function mapSiteSettingsRows(rows: SiteSettingRow[]): SiteSettings {
  const settings = { ...defaultSiteSettings };
  const contact = rows.find((row) => row.key === "contact")?.value;
  const socialLinks = rows.find((row) => row.key === "social_links")?.value;
  const appearance = rows.find((row) => row.key === "appearance")?.value;

  if (contact && typeof contact === "object" && !Array.isArray(contact)) {
    settings.hotline =
      typeof contact.hotline === "string" ? contact.hotline : settings.hotline;
    settings.email =
      typeof contact.email === "string" ? contact.email : settings.email;
    settings.zaloUrl =
      typeof contact.zalo_url === "string"
        ? contact.zalo_url
        : settings.zaloUrl;
    settings.address =
      typeof contact.address === "string" ? contact.address : settings.address;
  }

  if (
    socialLinks &&
    typeof socialLinks === "object" &&
    !Array.isArray(socialLinks)
  ) {
    if (Array.isArray(socialLinks.facebook_pages)) {
      settings.facebookPages = socialLinks.facebook_pages.map((page: { label?: unknown; url?: unknown }) => ({
        label: typeof page?.label === "string" ? page.label : "",
        url: typeof page?.url === "string" ? page.url : "",
      }));
    } else if (typeof socialLinks.facebook_url === "string" && socialLinks.facebook_url) {
      settings.facebookPages = [
        {
          label: typeof socialLinks.facebook_label === "string" ? socialLinks.facebook_label : "Facebook",
          url: socialLinks.facebook_url,
        },
      ];
    }
  }

  if (
    appearance &&
    typeof appearance === "object" &&
    !Array.isArray(appearance)
  ) {
    settings.logoPath =
      typeof appearance.logo_path === "string" && appearance.logo_path
        ? appearance.logo_path
        : settings.logoPath;
  }

  return settings;
}

type FeatureBadgeRow = Tables<"feature_badges">;
type ProductFeatureBadgeRow = Tables<"product_feature_badges">;

export function mapProductRows({
  products,
  categories,
  brands,
  sizes,
  flavors,
  benefits,
  usage,
  audiences,
  ingredients,
  variants,
  relatedProducts,
  badges = [],
  featureBadges = [],
  productFeatureBadges = [],
}: {
  products: ProductRow[];
  categories: CategoryRow[];
  brands: BrandRow[];
  badges?: ProductBadgeRow[];
  sizes: ProductSizeRow[];
  flavors: ProductFlavorRow[];
  benefits: ProductContentRow[];
  usage: ProductContentRow[];
  audiences: ProductContentRow[];
  ingredients: ProductIngredientRow[];
  variants: ProductVariantRow[];
  relatedProducts: RelatedProductRow[];
  featureBadges?: FeatureBadgeRow[];
  productFeatureBadges?: ProductFeatureBadgeRow[];
}): Product[] {
  const categoriesById = new Map(categories.map((row) => [row.id, row]));
  const brandsById = new Map(brands.map((row) => [row.id, row]));
  const sizesByProduct = groupBy(sizes, (row) => row.product_id);
  const flavorsByProduct = groupBy(flavors, (row) => row.product_id);
  const benefitsByProduct = groupBy(benefits, (row) => row.product_id);
  const usageByProduct = groupBy(usage, (row) => row.product_id);
  const audiencesByProduct = groupBy(audiences, (row) => row.product_id);
  const ingredientsByProduct = groupBy(ingredients, (row) => row.product_id);
  const variantsByProduct = groupBy(variants, (row) => row.product_id);
  const relatedByProduct = groupBy(relatedProducts, (row) => row.product_id);
  const badgesById = new Map(badges.map((row) => [row.id, row]));
  const featureBadgesById = new Map(featureBadges.map((row) => [row.id, row]));
  const featureBadgesByProduct = groupBy(productFeatureBadges, (row) => row.product_id);

  return products.map((product) => {
    const category = product.category_id
      ? categoriesById.get(product.category_id)
      : undefined;
    const brand = product.brand_id ? brandsById.get(product.brand_id) : undefined;
    const productName = localizedText(product.name);
    const categoryName = category
      ? localizedText(category.name)
      : { vi: "", en: "" };
    const primaryGoal = localizedText(
      product.primary_goal,
      categoryName.vi || productName.vi,
    );

    const productSizes = (sizesByProduct.get(product.id) ?? []).map((row) =>
      localizedText(row.label_i18n, row.label),
    );
    const productFlavors = (flavorsByProduct.get(product.id) ?? []).map((row) =>
      localizedText(row.name),
    );
    const productVariants = mapProductVariants(
      variantsByProduct.get(product.id) ?? [],
      productFlavors,
      productSizes,
    );
    const badgeType = normalizeProductBadgeType(product.badge_type);
    const productBadge = mapProductBadge(product, badgesById.get(product.badge_id ?? ""));

    const productFeatureBadges = (featureBadgesByProduct.get(product.id) ?? [])
      .map((row) => featureBadgesById.get(row.badge_id))
      .filter((b): b is FeatureBadgeRow => b !== undefined)
      .map((badge, idx) => ({
        id: badge.id,
        label: localizedText(badge.label),
        imagePath: badge.image_path,
        isActive: badge.is_active,
        sortOrder: badge.sort_order ?? idx,
      }));

    return {
      id: product.id,
      name: productName,
      slug: product.slug,
      brand: brand?.name ?? "",
      categoryId: category?.id ?? "",
      categoryName,
      origin: product.origin ?? "",
      price: Number(product.price),
      listPrice: product.list_price === null ? null : Number(product.list_price),
      sizes: productSizes.map((size) => size.vi),
      flavors: productFlavors,
      primaryGoal,
      shortDescription: localizedText(product.short_description),
      imagePath: product.image_path,
      nutritionImagePath: product.nutrition_image_path,
      visual: {
        packageType: normalizePackageType(product.package_type),
        accent: product.visual_accent ?? "#ce1732",
        background: product.visual_background ?? "#fff1f2",
        badge: primaryGoal,
      },
      benefits: (benefitsByProduct.get(product.id) ?? []).map((row) =>
        localizedContentText(row.content),
      ),
      ingredients: (ingredientsByProduct.get(product.id) ?? []).map((row) => ({
        name: row.name,
        amount: row.amount,
      })),
      variants: productVariants,
      usage: (usageByProduct.get(product.id) ?? []).map((row) =>
        localizedContentText(row.content),
      ),
      audience: (audiencesByProduct.get(product.id) ?? []).map((row) =>
        localizedContentText(row.content),
      ),
      relatedProductIds: (relatedByProduct.get(product.id) ?? []).map(
        (row) => row.related_product_id,
      ),
      isFeatured: product.is_featured,
      isBestSeller: product.is_best_seller,
      badge: productBadge ?? mapLegacyProductBadge(badgeType),
      badgeType,
      featureBadges: productFeatureBadges,
    };
  });
}

export function mapProductBadgeRow(row: ProductBadgeRow): ProductBadge {
  return {
    id: row.id,
    label: normalizeBadgeLabel(row.label),
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

function mapProductBadge(
  product: ProductRow,
  badge: ProductBadgeRow | undefined,
): ProductBadge | null {
  if (!product.badge_id || !badge || !badge.is_active) {
    return null;
  }

  return mapProductBadgeRow(badge);
}

function mapLegacyProductBadge(type: Product["badgeType"]): ProductBadge | null {
  const label = getLegacyBadgeLabel(type);

  if (!label) {
    return null;
  }

  return {
    id: `legacy_${type}`,
    label,
    isActive: true,
    sortOrder: 0,
  };
}

function mapProductVariants(
  rows: ProductVariantRow[],
  flavors: Product["flavors"],
  sizes: LocalizedText[],
): ProductVariant[] {
  const variants = rows
    .map((row) => {
      const flavor = localizedText(row.flavor_name);
      const size = localizedText(row.size_name, row.size_label);

      return {
        id: row.id,
        combinationKey: row.combination_key,
        flavor,
        flavorKey: buildOptionKey(flavor.vi || flavor.en),
        size,
        sizeKey: buildOptionKey(size.vi || size.en),
        price: row.price === null ? null : Number(row.price),
        listPrice: row.list_price === null ? null : Number(row.list_price),
        currency: row.currency,
        imagePath: row.image_path,
        nutritionImagePath: row.nutrition_image_path,
        isDefault: row.is_default,
        isPublished: row.is_published,
        sortOrder: row.sort_order,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (variants.length || !flavors.length || !sizes.length) {
    return variants;
  }

  return flavors.flatMap((flavor, flavorIndex) =>
    sizes.map((size, sizeIndex) => {
      const sortOrder = flavorIndex * sizes.length + sizeIndex + 1;

      return {
        id: `${buildOptionKey(flavor.vi || flavor.en)}-${buildOptionKey(
          size.vi || size.en,
        )}`,
        combinationKey: buildVariantKey(flavor, size),
        flavor,
        flavorKey: buildOptionKey(flavor.vi || flavor.en),
        size,
        sizeKey: buildOptionKey(size.vi || size.en),
        price: null,
        listPrice: null,
        currency: null,
        imagePath: null,
        nutritionImagePath: null,
        isDefault: sortOrder === 1,
        isPublished: true,
        sortOrder,
      };
    }),
  );
}

function normalizePackageType(value: string | null): Product["visual"]["packageType"] {
  if (value === "gel" || value === "tube" || value === "tub" || value === "pouch") {
    return value;
  }

  return "gel";
}

function groupBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
    return groups;
  }, new Map<string, T[]>());
}
