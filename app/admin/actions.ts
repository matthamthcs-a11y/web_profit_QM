"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getBool,
  getIngredientLines,
  getLines,
  getLocalized,
  getLocalizedLines,
  getNumber,
  getOptionalString,
  getString,
  slugify,
} from "@/lib/admin/form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminNoticeType = "success" | "error";

type SortableTable =
  | "products"
  | "categories"
  | "brands"
  | "home_banners"
  | "documents"
  | "dealers"
  | "testimonials";

type SlugTable = "products" | "categories" | "brands";

const adminPaths = [
  "/",
  "/products",
  "/certificates",
  "/dealers",
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/brands",
  "/admin/banners",
  "/admin/documents",
  "/admin/dealers",
  "/admin/testimonials",
  "/admin/leads",
  "/admin/settings",
];

function revalidateAdminData() {
  adminPaths.forEach((path) => revalidatePath(path));
}

async function getAdminClient() {
  await requireAdmin();

  return createSupabaseServerClient();
}

async function setAdminNotice(type: AdminNoticeType, message: string) {
  const cookieStore = await cookies();

  cookieStore.set(
    "admin_notice",
    encodeURIComponent(JSON.stringify({ type, message })),
    {
      path: "/admin",
      maxAge: 30,
      sameSite: "lax",
    },
  );
}

function getDesiredPosition(formData: FormData) {
  return getNumber(formData, "sort_order", 1);
}

function validatePosition(position: number) {
  return Number.isInteger(position) && position > 0;
}

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function hasLocalizedValue(value: { vi: string; en: string }) {
  return Boolean(value.vi || value.en);
}

function isValidCurrency(value: string) {
  return /^[A-Z]{3}$/.test(value);
}

function isValidHexColor(value: string | null) {
  return !value || /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

async function ensureUniqueSlug({
  supabase,
  table,
  slug,
  id,
  label,
}: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  table: SlugTable;
  slug: string;
  id: string;
  label: string;
}) {
  if (!slug || !isValidSlug(slug)) {
    await setAdminNotice(
      "error",
      `${label}: slug chỉ được gồm chữ thường, số và dấu gạch ngang.`,
    );

    return false;
  }

  let query = supabase.from(table).select("id").eq("slug", slug).limit(1);

  if (id) {
    query = query.neq("id", id);
  }

  const { data } = await query;

  if (data && data.length > 0) {
    await setAdminNotice(
      "error",
      `${label}: slug "${slug}" đã tồn tại. Vui lòng đổi tên hoặc sửa slug.`,
    );

    return false;
  }

  return true;
}

async function normalizeSortOrder({
  supabase,
  table,
  id,
  desiredPosition,
}: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  table: SortableTable;
  id: string;
  desiredPosition: number;
}) {
  const { data } = await supabase
    .from(table)
    .select("id")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const rows = data ?? [];
  const currentIndex = rows.findIndex((row) => row.id === id);

  if (currentIndex === -1) {
    return;
  }

  const [current] = rows.splice(currentIndex, 1);
  const clampedPosition = Math.min(desiredPosition, rows.length + 1);

  rows.splice(clampedPosition - 1, 0, current);

  await Promise.all(
    rows.map((row, index) =>
      supabase.from(table).update({ sort_order: index + 1 }).eq("id", row.id),
    ),
  );
}

export async function upsertCategory(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");
  const name = getLocalized(formData, "name");
  const desiredPosition = getDesiredPosition(formData);
  const slug = getString(formData, "slug") || slugify(name.en || name.vi);

  if (!hasLocalizedValue(name)) {
    await setAdminNotice("error", "Danh muc: can nhap ten VI hoac EN.");
    return;
  }

  if (!validatePosition(desiredPosition)) {
    await setAdminNotice("error", "Danh mục: vị trí hiển thị phải lớn hơn 0.");
    return;
  }

  if (
    !(await ensureUniqueSlug({
      supabase,
      table: "categories",
      slug,
      id,
      label: "Danh mục",
    }))
  ) {
    return;
  }

  const payload = {
    slug,
    name,
    description: getLocalized(formData, "description"),
    sort_order: desiredPosition,
    is_featured: getBool(formData, "is_featured"),
    is_active: getBool(formData, "is_active"),
  };
  let categoryId = id;

  if (id) {
    await supabase.from("categories").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("categories")
      .insert(payload)
      .select("id")
      .single();
    categoryId = data?.id ?? "";
  }

  if (categoryId) {
    await normalizeSortOrder({
      supabase,
      table: "categories",
      id: categoryId,
      desiredPosition,
    });
  }

  revalidateAdminData();
  await setAdminNotice("success", "Đã lưu danh mục.");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");

  if (id) {
    await supabase.from("categories").delete().eq("id", id);
    await setAdminNotice("success", "Đã xóa danh mục.");
  }

  revalidateAdminData();
}

export async function upsertBrand(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const desiredPosition = getDesiredPosition(formData);
  const slug = getString(formData, "slug") || slugify(name);

  if (!name) {
    await setAdminNotice("error", "Thuong hieu: can nhap ten.");
    return;
  }

  if (!validatePosition(desiredPosition)) {
    await setAdminNotice("error", "Thương hiệu: vị trí hiển thị phải lớn hơn 0.");
    return;
  }

  if (
    !(await ensureUniqueSlug({
      supabase,
      table: "brands",
      slug,
      id,
      label: "Thương hiệu",
    }))
  ) {
    return;
  }

  const payload = {
    slug,
    name,
    origin: getOptionalString(formData, "origin"),
    description: getLocalized(formData, "description"),
    logo_path: getOptionalString(formData, "logo_path"),
    sort_order: desiredPosition,
    is_active: getBool(formData, "is_active"),
  };
  let brandId = id;

  if (id) {
    await supabase.from("brands").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("brands")
      .insert(payload)
      .select("id")
      .single();
    brandId = data?.id ?? "";
  }

  if (brandId) {
    await normalizeSortOrder({
      supabase,
      table: "brands",
      id: brandId,
      desiredPosition,
    });
  }

  revalidateAdminData();
  await setAdminNotice("success", "Đã lưu thương hiệu.");
}

export async function deleteBrand(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");

  if (id) {
    await supabase.from("brands").delete().eq("id", id);
    await setAdminNotice("success", "Đã xóa thương hiệu.");
  }

  revalidateAdminData();
}

export async function upsertProduct(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");
  const name = getLocalized(formData, "name");
  const desiredPosition = getDesiredPosition(formData);
  const price = getNumber(formData, "price");
  const slug = getString(formData, "slug") || slugify(name.en || name.vi);
  const currency = (getString(formData, "currency") || "VND").toUpperCase();
  const visualAccent = getOptionalString(formData, "visual_accent") ?? "#ce1732";
  const visualBackground =
    getOptionalString(formData, "visual_background") ?? "#fff1f2";

  if (!hasLocalizedValue(name)) {
    await setAdminNotice("error", "San pham: can nhap ten VI hoac EN.");
    return;
  }

  if (!validatePosition(desiredPosition)) {
    await setAdminNotice("error", "Sản phẩm: vị trí hiển thị phải lớn hơn 0.");
    return;
  }

  if (price < 0) {
    await setAdminNotice("error", "Sản phẩm: giá không được âm.");
    return;
  }

  if (!isValidCurrency(currency)) {
    await setAdminNotice("error", "San pham: tien te phai la ma 3 chu cai, vi du VND.");
    return;
  }

  if (!isValidHexColor(visualAccent) || !isValidHexColor(visualBackground)) {
    await setAdminNotice("error", "San pham: ma mau phai co dang #ce1732.");
    return;
  }

  if (
    !(await ensureUniqueSlug({
      supabase,
      table: "products",
      slug,
      id,
      label: "Sản phẩm",
    }))
  ) {
    return;
  }

  const payload = {
    slug,
    category_id: getOptionalString(formData, "category_id"),
    brand_id: getOptionalString(formData, "brand_id"),
    name,
    short_description: getLocalized(formData, "short_description"),
    primary_goal: getLocalized(formData, "primary_goal"),
    origin: getOptionalString(formData, "origin"),
    price,
    currency,
    image_path: getOptionalString(formData, "image_path"),
    nutrition_image_path: getOptionalString(formData, "nutrition_image_path"),
    package_type: getOptionalString(formData, "package_type"),
    visual_accent: visualAccent,
    visual_background: visualBackground,
    is_featured: getBool(formData, "is_featured"),
    is_best_seller: getBool(formData, "is_best_seller"),
    is_published: getBool(formData, "is_published"),
    sort_order: desiredPosition,
  };
  let productId = id;

  if (productId) {
    await supabase.from("products").update(payload).eq("id", productId);
  } else {
    const { data } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    productId = data?.id ?? "";
  }

  if (productId) {
    await normalizeSortOrder({
      supabase,
      table: "products",
      id: productId,
      desiredPosition,
    });
    await syncProductChildren(supabase, productId, formData);
    await syncRelatedProducts(supabase, productId, formData);
  }

  revalidateAdminData();
  if (payload.slug) {
    revalidatePath(`/products/${payload.slug}`);
  }
  await setAdminNotice("success", "Đã lưu sản phẩm.");
}

async function syncProductChildren(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  productId: string,
  formData: FormData,
) {
  await Promise.all([
    supabase.from("product_sizes").delete().eq("product_id", productId),
    supabase.from("product_flavors").delete().eq("product_id", productId),
    supabase.from("product_benefits").delete().eq("product_id", productId),
    supabase.from("product_usage").delete().eq("product_id", productId),
    supabase.from("product_audiences").delete().eq("product_id", productId),
    supabase.from("product_ingredients").delete().eq("product_id", productId),
  ]);

  const sizes = getLines(formData, "sizes").map((label, index) => ({
    product_id: productId,
    label,
    sort_order: index,
  }));
  const flavors = getLocalizedLines(formData, "flavors").map((name, index) => ({
    product_id: productId,
    name,
    sort_order: index,
  }));
  const benefits = getLocalizedLines(formData, "benefits").map(
    (content, index) => ({
      product_id: productId,
      content,
      sort_order: index,
    }),
  );
  const usage = getLocalizedLines(formData, "usage").map((content, index) => ({
    product_id: productId,
    content,
    sort_order: index,
  }));
  const audiences = getLocalizedLines(formData, "audiences").map(
    (content, index) => ({
      product_id: productId,
      content,
      sort_order: index,
    }),
  );
  const ingredients = getIngredientLines(formData, "ingredients").map(
    (item, index) => ({
      product_id: productId,
      name: item.name,
      amount: item.amount,
      sort_order: index,
    }),
  );

  await Promise.all([
    sizes.length ? supabase.from("product_sizes").insert(sizes) : undefined,
    flavors.length ? supabase.from("product_flavors").insert(flavors) : undefined,
    benefits.length
      ? supabase.from("product_benefits").insert(benefits)
      : undefined,
    usage.length ? supabase.from("product_usage").insert(usage) : undefined,
    audiences.length
      ? supabase.from("product_audiences").insert(audiences)
      : undefined,
    ingredients.length
      ? supabase.from("product_ingredients").insert(ingredients)
      : undefined,
  ]);
}

async function syncRelatedProducts(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  productId: string,
  formData: FormData,
) {
  const relatedIds = Array.from(
    new Set(
      formData
        .getAll("related_product_ids")
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter((value) => value && value !== productId),
    ),
  );

  await supabase.from("related_products").delete().eq("product_id", productId);

  if (!relatedIds.length) {
    return;
  }

  await supabase.from("related_products").insert(
    relatedIds.map((relatedProductId, index) => ({
      product_id: productId,
      related_product_id: relatedProductId,
      sort_order: index + 1,
    })),
  );
}

export async function deleteProduct(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");

  if (id) {
    await supabase.from("products").delete().eq("id", id);
    await setAdminNotice("success", "Đã xóa sản phẩm.");
  }

  revalidateAdminData();
}

export async function upsertBanner(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");
  const desiredPosition = getDesiredPosition(formData);
  const imagePath = getString(formData, "image_path");

  if (!imagePath) {
    await setAdminNotice("error", "Banner: can co image path hoac upload anh.");
    return;
  }

  if (!validatePosition(desiredPosition)) {
    await setAdminNotice("error", "Banner: vị trí hiển thị phải lớn hơn 0.");
    return;
  }

  const payload = {
    image_path: imagePath,
    mobile_image_path: getOptionalString(formData, "mobile_image_path"),
    alt: getLocalized(formData, "alt"),
    link_url: getOptionalString(formData, "link_url"),
    sort_order: desiredPosition,
    is_active: getBool(formData, "is_active"),
  };
  let bannerId = id;

  if (id) {
    await supabase.from("home_banners").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("home_banners")
      .insert(payload)
      .select("id")
      .single();
    bannerId = data?.id ?? "";
  }

  if (bannerId) {
    await normalizeSortOrder({
      supabase,
      table: "home_banners",
      id: bannerId,
      desiredPosition,
    });
  }

  revalidateAdminData();
  await setAdminNotice("success", "Đã lưu banner.");
}

export async function deleteBanner(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");

  if (id) {
    await supabase.from("home_banners").delete().eq("id", id);
    await setAdminNotice("success", "Đã xóa banner.");
  }

  revalidateAdminData();
}

export async function upsertDocument(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");
  const desiredPosition = getDesiredPosition(formData);
  const title = getLocalized(formData, "title");

  if (!hasLocalizedValue(title)) {
    await setAdminNotice("error", "Tai lieu: can nhap tieu de VI hoac EN.");
    return;
  }

  if (!validatePosition(desiredPosition)) {
    await setAdminNotice("error", "Tài liệu: vị trí hiển thị phải lớn hơn 0.");
    return;
  }

  const payload = {
    type: getString(formData, "type") || "certificate",
    title,
    description: getLocalized(formData, "description"),
    file_path: getOptionalString(formData, "file_path"),
    thumbnail_path: getOptionalString(formData, "thumbnail_path"),
    sort_order: desiredPosition,
    is_published: getBool(formData, "is_published"),
  };
  let documentId = id;

  if (id) {
    await supabase.from("documents").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("documents")
      .insert(payload)
      .select("id")
      .single();
    documentId = data?.id ?? "";
  }

  if (documentId) {
    await normalizeSortOrder({
      supabase,
      table: "documents",
      id: documentId,
      desiredPosition,
    });
  }

  revalidateAdminData();
  await setAdminNotice("success", "Đã lưu tài liệu.");
}

export async function deleteDocument(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");

  if (id) {
    await supabase.from("documents").delete().eq("id", id);
    await setAdminNotice("success", "Đã xóa tài liệu.");
  }

  revalidateAdminData();
}

export async function upsertDealer(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");
  const desiredPosition = getDesiredPosition(formData);
  const name = getString(formData, "name");

  if (!name) {
    await setAdminNotice("error", "Dai ly: can nhap ten.");
    return;
  }

  if (!validatePosition(desiredPosition)) {
    await setAdminNotice("error", "Đại lý: vị trí hiển thị phải lớn hơn 0.");
    return;
  }

  const payload = {
    name,
    city: getOptionalString(formData, "city"),
    address: getOptionalString(formData, "address"),
    phone: getOptionalString(formData, "phone"),
    zalo: getOptionalString(formData, "zalo"),
    map_url: getOptionalString(formData, "map_url"),
    sort_order: desiredPosition,
    is_active: getBool(formData, "is_active"),
  };
  let dealerId = id;

  if (id) {
    await supabase.from("dealers").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("dealers")
      .insert(payload)
      .select("id")
      .single();
    dealerId = data?.id ?? "";
  }

  if (dealerId) {
    await normalizeSortOrder({
      supabase,
      table: "dealers",
      id: dealerId,
      desiredPosition,
    });
  }

  revalidateAdminData();
  await setAdminNotice("success", "Đã lưu đại lý.");
}

export async function deleteDealer(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");

  if (id) {
    await supabase.from("dealers").delete().eq("id", id);
    await setAdminNotice("success", "Đã xóa đại lý.");
  }

  revalidateAdminData();
}

export async function upsertTestimonial(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");
  const desiredPosition = getDesiredPosition(formData);
  const rating = getNumber(formData, "rating", 5);
  const name = getString(formData, "name");
  const quote = getLocalized(formData, "quote");

  if (!name) {
    await setAdminNotice("error", "Phan hoi: can nhap ten khach hang.");
    return;
  }

  if (!hasLocalizedValue(quote)) {
    await setAdminNotice("error", "Phan hoi: can nhap noi dung VI hoac EN.");
    return;
  }

  if (!validatePosition(desiredPosition)) {
    await setAdminNotice("error", "Phản hồi: vị trí hiển thị phải lớn hơn 0.");
    return;
  }

  if (rating < 1 || rating > 5) {
    await setAdminNotice("error", "Phản hồi: rating phải từ 1 đến 5.");
    return;
  }

  const payload = {
    name,
    role: getOptionalString(formData, "role"),
    rating,
    quote,
    sort_order: desiredPosition,
    is_published: getBool(formData, "is_published"),
  };
  let testimonialId = id;

  if (id) {
    await supabase.from("testimonials").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("testimonials")
      .insert(payload)
      .select("id")
      .single();
    testimonialId = data?.id ?? "";
  }

  if (testimonialId) {
    await normalizeSortOrder({
      supabase,
      table: "testimonials",
      id: testimonialId,
      desiredPosition,
    });
  }

  revalidateAdminData();
  await setAdminNotice("success", "Đã lưu phản hồi khách hàng.");
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");

  if (id) {
    await supabase.from("testimonials").delete().eq("id", id);
    await setAdminNotice("success", "Đã xóa phản hồi khách hàng.");
  }

  revalidateAdminData();
}

export async function updateLeadStatus(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");
  const status = getString(formData, "status") || "new";

  if (id) {
    await supabase.from("contact_leads").update({ status }).eq("id", id);
    await setAdminNotice("success", "Đã cập nhật trạng thái lead.");
  }

  revalidateAdminData();
}

export async function deleteLead(formData: FormData) {
  const supabase = await getAdminClient();
  const id = getString(formData, "id");

  if (id) {
    await supabase.from("contact_leads").delete().eq("id", id);
    await setAdminNotice("success", "Đã xóa lead.");
  }

  revalidateAdminData();
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await getAdminClient();
  const hotline = getString(formData, "hotline");
  const email = getString(formData, "email");

  if (!hotline) {
    await setAdminNotice("error", "Cai dat: hotline la bat buoc.");
    return;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    await setAdminNotice("error", "Cai dat: email khong dung dinh dang.");
    return;
  }

  const contact = {
    hotline,
    email,
    zalo_url: getString(formData, "zalo_url"),
    address: getString(formData, "address"),
  };
  const socialLinks = {
    facebook_label: getString(formData, "facebook_label"),
    facebook_url: getString(formData, "facebook_url"),
  };
  const seo = {
    title: getString(formData, "seo_title"),
    description: getString(formData, "seo_description"),
  };

  await Promise.all([
    supabase
      .from("site_settings")
      .upsert({ key: "contact", value: contact, is_public: true }),
    supabase
      .from("site_settings")
      .upsert({ key: "social_links", value: socialLinks, is_public: true }),
    supabase
      .from("site_settings")
      .upsert({ key: "seo", value: seo, is_public: true }),
  ]);

  revalidateAdminData();
  await setAdminNotice("success", "Đã cập nhật cài đặt website.");
}
