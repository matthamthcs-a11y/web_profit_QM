import { unstable_cache } from "next/cache";
import { products as mockProducts } from "@/lib/mock-data";
import { mapProductRows } from "@/lib/data/mappers";
import { getSupabaseDataClient } from "@/lib/data/source";

const getProductsCached = unstable_cache(
  async () => getProductsUncached(),
  ["profitness-products"],
  { revalidate: 300, tags: ["products"] },
);

export async function getProducts() {
  return getProductsCached();
}

async function getProductsUncached() {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return mockProducts;
  }

  const [
    productsResult,
    categoriesResult,
    brandsResult,
    sizesResult,
    flavorsResult,
    benefitsResult,
    usageResult,
    audiencesResult,
    ingredientsResult,
    relatedProductsResult,
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase.from("categories").select("*"),
    supabase.from("brands").select("*"),
    supabase
      .from("product_sizes")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_flavors")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_benefits")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_usage")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_audiences")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_ingredients")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("related_products")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  const hasError = [
    productsResult,
    categoriesResult,
    brandsResult,
    sizesResult,
    flavorsResult,
    benefitsResult,
    usageResult,
    audiencesResult,
    ingredientsResult,
    relatedProductsResult,
  ].some((result) => result.error);

  if (hasError) {
    return mockProducts;
  }

  return mapProductRows({
    products: productsResult.data ?? [],
    categories: categoriesResult.data ?? [],
    brands: brandsResult.data ?? [],
    sizes: sizesResult.data ?? [],
    flavors: flavorsResult.data ?? [],
    benefits: benefitsResult.data ?? [],
    usage: usageResult.data ?? [],
    audiences: audiencesResult.data ?? [],
    ingredients: ingredientsResult.data ?? [],
    relatedProducts: relatedProductsResult.data ?? [],
  });
}

export async function getBestSellerProducts() {
  const products = await getProducts();

  return products.filter((product) => product.isBestSeller);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();

  return products.find((product) => product.slug === slug);
}

export async function getRelatedProducts(productIds: string[]) {
  const products = await getProducts();

  return products.filter((product) => productIds.includes(product.id));
}
