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
    customers,
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
    supabase.from("customers").select("id", { count: "exact", head: true }),
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
    customers: customers.count ?? 0,
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

async function fetchAllPaged<T>(
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>,
  pageSize = 1000,
): Promise<T[]> {
  const all: T[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await fetchPage(from, from + pageSize - 1);
    if (error || !data || data.length === 0) {
      if (error) console.error("fetchAllPaged error:", error);
      break;
    }
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return all;
}

function normalizePhoneKey(phone?: string | null): string {
  const digits = (phone || "").replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("84") && digits.length >= 10) {
    return `0${digits.slice(2)}`;
  }
  if (digits.length === 9 && !digits.startsWith("0")) {
    return `0${digits}`;
  }
  return digits;
}

export async function getAdminOrders(options?: {
  status?: string;
  search?: string;
}) {
  const supabase = await createSupabaseServerClient();

  const orders = await fetchAllPaged((from, to) => {
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.search) {
      const s = options.search.trim();
      query = query.or(
        `order_code.ilike.%${s}%,customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%`,
      );
    }

    return query;
  });

  if (orders.length === 0) return [];

  const orderIdSet = new Set(orders.map((o) => o.id));
  const items =
    orders.length <= 100
      ? await fetchAllPaged((from, to) =>
          supabase
            .from("order_items")
            .select("*")
            .in("order_id", Array.from(orderIdSet))
            .range(from, to),
        )
      : await fetchAllPaged((from, to) =>
          supabase
            .from("order_items")
            .select("*")
            .order("created_at", { ascending: false })
            .range(from, to),
        );

  const itemsByOrderId = new Map<string, typeof items>();
  items.forEach((item) => {
    if (!orderIdSet.has(item.order_id)) return;
    const list = itemsByOrderId.get(item.order_id) || [];
    list.push(item);
    itemsByOrderId.set(item.order_id, list);
  });

  return orders.map((order) => ({
    ...order,
    order_items: itemsByOrderId.get(order.id) || [],
  }));
}

export type AdminCustomerOrderSummary = {
  id: string;
  order_code: string;
  total_amount: number;
  status: string;
  source_domain: string | null;
  created_at: string;
};

export type AdminCustomerWithStats = {
  id: string;
  legacy_id: number | null;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  source_domain: string;
  created_at: string;
  updated_at: string;
  order_count: number;
  total_spent: number;
  last_order_at: string | null;
  orders: AdminCustomerOrderSummary[];
};

export async function getAdminCustomers(): Promise<AdminCustomerWithStats[]> {
  const supabase = await createSupabaseServerClient();

  const [customers, orders] = await Promise.all([
    fetchAllPaged((from, to) =>
      supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to),
    ),
    fetchAllPaged((from, to) =>
      supabase
        .from("orders")
        .select(
          "id, order_code, customer_phone, customer_email, total_amount, status, source_domain, created_at",
        )
        .order("created_at", { ascending: false })
        .range(from, to),
    ),
  ]);

  const ordersByPhone = new Map<string, AdminCustomerOrderSummary[]>();
  const ordersByEmail = new Map<string, AdminCustomerOrderSummary[]>();

  for (const o of orders) {
    const summary: AdminCustomerOrderSummary = {
      id: o.id,
      order_code: o.order_code,
      total_amount: Number(o.total_amount) || 0,
      status: o.status,
      source_domain: o.source_domain,
      created_at: o.created_at,
    };

    const phoneKey = normalizePhoneKey(o.customer_phone);
    if (phoneKey) {
      const list = ordersByPhone.get(phoneKey) || [];
      list.push(summary);
      ordersByPhone.set(phoneKey, list);
    }

    const emailKey = (o.customer_email || "").trim().toLowerCase();
    if (emailKey) {
      const list = ordersByEmail.get(emailKey) || [];
      list.push(summary);
      ordersByEmail.set(emailKey, list);
    }
  }

  return customers.map((customer) => {
    const matchedMap = new Map<string, AdminCustomerOrderSummary>();
    const phoneKey = normalizePhoneKey(customer.phone);
    const emailKey = (customer.email || "").trim().toLowerCase();

    if (phoneKey) {
      for (const o of ordersByPhone.get(phoneKey) || []) {
        matchedMap.set(o.id, o);
      }
    }
    if (emailKey) {
      for (const o of ordersByEmail.get(emailKey) || []) {
        matchedMap.set(o.id, o);
      }
    }

    const matchedOrders = Array.from(matchedMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const totalSpent = matchedOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total_amount, 0);

    return {
      ...customer,
      order_count: matchedOrders.length,
      total_spent: totalSpent,
      last_order_at: matchedOrders[0]?.created_at ?? null,
      orders: matchedOrders,
    };
  });
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
