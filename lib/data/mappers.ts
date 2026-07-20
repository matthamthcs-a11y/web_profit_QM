import type {
  Brand,
  Category,
  Dealer,
  DocumentAsset,
  HomeBanner,
  LocalizedText,
  Product,
  ProductVariant,
  Testimonial,
} from "@/lib/types";
import type { Json, Tables } from "@/lib/supabase/database.types";
import type { SiteSettings } from "@/lib/data/site-settings";
import { buildOptionKey, buildVariantKey } from "@/lib/product-variants";

type ProductRow = Tables<"products">;
type CategoryRow = Tables<"categories">;
type BrandRow = Tables<"brands">;
type ProductSizeRow = Tables<"product_sizes">;
type ProductFlavorRow = Tables<"product_flavors">;
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
  facebookLabel: "Pro-Fitness Vietnam",
  facebookUrl: "",
  address: "Ho Chi Minh City, Vietnam",
};

export function localizedText(value: Json | null, fallback = ""): LocalizedText {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const vi = typeof value.vi === "string" ? value.vi : fallback;
    const en = typeof value.en === "string" ? value.en : vi || fallback;

    return { vi, en };
  }

  return { vi: fallback, en: fallback };
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
    settings.facebookLabel =
      typeof socialLinks.facebook_label === "string"
        ? socialLinks.facebook_label
        : settings.facebookLabel;
    settings.facebookUrl =
      typeof socialLinks.facebook_url === "string"
        ? socialLinks.facebook_url
        : settings.facebookUrl;
  }

  return settings;
}

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
}: {
  products: ProductRow[];
  categories: CategoryRow[];
  brands: BrandRow[];
  sizes: ProductSizeRow[];
  flavors: ProductFlavorRow[];
  benefits: ProductContentRow[];
  usage: ProductContentRow[];
  audiences: ProductContentRow[];
  ingredients: ProductIngredientRow[];
  variants: ProductVariantRow[];
  relatedProducts: RelatedProductRow[];
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

    return {
      id: product.id,
      name: productName,
      slug: product.slug,
      brand: brand?.name ?? "",
      categoryId: category?.id ?? "",
      categoryName,
      origin: product.origin ?? "",
      price: Number(product.price),
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
        localizedText(row.content),
      ),
      ingredients: (ingredientsByProduct.get(product.id) ?? []).map((row) => ({
        name: row.name,
        amount: row.amount,
      })),
      variants: productVariants,
      usage: (usageByProduct.get(product.id) ?? []).map((row) =>
        localizedText(row.content),
      ),
      audience: (audiencesByProduct.get(product.id) ?? []).map((row) =>
        localizedText(row.content),
      ),
      relatedProductIds: (relatedByProduct.get(product.id) ?? []).map(
        (row) => row.related_product_id,
      ),
      isFeatured: product.is_featured,
      isBestSeller: product.is_best_seller,
    };
  });
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
