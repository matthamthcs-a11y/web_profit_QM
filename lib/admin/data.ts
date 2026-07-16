import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminDashboardData() {
  const supabase = await createSupabaseServerClient();
  const [
    products,
    categories,
    brands,
    banners,
    documents,
    dealers,
    testimonials,
    leads,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("brands").select("id", { count: "exact", head: true }),
    supabase.from("home_banners").select("id", { count: "exact", head: true }),
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase.from("dealers").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  return {
    products: products.count ?? 0,
    categories: categories.count ?? 0,
    brands: brands.count ?? 0,
    banners: banners.count ?? 0,
    documents: documents.count ?? 0,
    dealers: dealers.count ?? 0,
    testimonials: testimonials.count ?? 0,
    newLeads: leads.count ?? 0,
  };
}

export async function getAdminCatalogOptions() {
  const supabase = await createSupabaseServerClient();
  const [categories, brands] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, name")
      .order("sort_order", { ascending: true }),
    supabase
      .from("brands")
      .select("id, slug, name")
      .order("sort_order", { ascending: true }),
  ]);

  return {
    categories: categories.data ?? [],
    brands: brands.data ?? [],
  };
}

export async function getAdminProductEditorData(editProductId?: string) {
  const supabase = await createSupabaseServerClient();
  const [products, categories, brands] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("categories")
      .select("id, slug, name")
      .order("sort_order", { ascending: true }),
    supabase
      .from("brands")
      .select("id, slug, name")
      .order("sort_order", { ascending: true }),
  ]);

  const [
    sizes,
    flavors,
    benefits,
    usage,
    audiences,
    ingredients,
    relatedProducts,
  ] = editProductId
    ? await Promise.all([
        supabase
          .from("product_sizes")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_flavors")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_benefits")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_usage")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_audiences")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_ingredients")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("related_products")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
      ])
    : [
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
      ];

  return {
    products: products.data ?? [],
    categories: categories.data ?? [],
    brands: brands.data ?? [],
    sizes: sizes.data ?? [],
    flavors: flavors.data ?? [],
    benefits: benefits.data ?? [],
    usage: usage.data ?? [],
    audiences: audiences.data ?? [],
    ingredients: ingredients.data ?? [],
    relatedProducts: relatedProducts.data ?? [],
  };
}

export async function getAdminCategories() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getAdminBrands() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getAdminBanners() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("home_banners")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getAdminDocuments() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getAdminDealers() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("dealers")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getAdminTestimonials() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getAdminLeads() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("contact_leads")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAdminSettings() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .in("key", ["contact", "social_links", "seo"]);

  return data ?? [];
}
