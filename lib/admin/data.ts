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
    orders,
    newOrders,
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
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
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
    totalOrders: orders.count ?? 0,
    newOrders: newOrders.count ?? 0,
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
  const [products, categories, brands, productBadges, featureBadges] = await Promise.all([
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
    supabase
      .from("product_badges")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("feature_badges")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const [
    sizes,
    flavors,
    benefits,
    usage,
    audiences,
    variants,
    relatedProducts,
    productFeatureBadges,
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
          .from("product_variants")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("related_products")
          .select("*")
          .eq("product_id", editProductId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_feature_badges")
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
        { data: [] },
      ];

  return {
    products: products.data ?? [],
    categories: categories.data ?? [],
    brands: brands.data ?? [],
    productBadges: productBadges.data ?? [],
    featureBadges: featureBadges.data ?? [],
    editData: {
      sizes: sizes.data ?? [],
      flavors: flavors.data ?? [],
      benefits: benefits.data ?? [],
      usage: usage.data ?? [],
      audiences: audiences.data ?? [],
      variants: variants.data ?? [],
      relatedProducts: relatedProducts.data ?? [],
      productFeatureBadges: productFeatureBadges.data ?? [],
    },
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

export async function getAdminFeatureBadges() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("feature_badges")
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

export async function getAdminOrders(options?: {
  status?: string;
  search?: string;
}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.search) {
    const s = options.search.trim();
    query = query.or(
      `order_code.ilike.%${s}%,customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%`,
    );
  }

  const { data: orders, error: ordersError } = await query;
  if (ordersError || !orders) {
    console.error("getAdminOrders error:", ordersError);
    return [];
  }

  const orderIds = orders.map((o) => o.id);
  if (orderIds.length === 0) return [];

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError) {
    console.error("getAdminOrders items error:", itemsError);
  }

  const itemsByOrderId = new Map<string, NonNullable<typeof items>>();
  (items || []).forEach((item) => {
    const list = itemsByOrderId.get(item.order_id) || [];
    list.push(item);
    itemsByOrderId.set(item.order_id, list);
  });

  return orders.map((order) => ({
    ...order,
    order_items: itemsByOrderId.get(order.id) || [],
  }));
}

export async function getAdminOrderById(id: string) {
  const supabase = await createSupabaseServerClient();
  const [{ data: order, error: orderError }, { data: items, error: itemsError }] =
    await Promise.all([
      supabase.from("orders").select("*").eq("id", id).single(),
      supabase.from("order_items").select("*").eq("order_id", id),
    ]);

  if (orderError || !order) {
    console.error("getAdminOrderById error:", orderError, itemsError);
    return null;
  }

  return {
    ...order,
    order_items: items || [],
  };
}

export async function getAdminSettings() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .in("key", ["contact", "social_links", "seo", "appearance"]);

  return data ?? [];
}
