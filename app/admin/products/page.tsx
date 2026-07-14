import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { deleteProduct, upsertProduct } from "@/app/admin/actions";
import { AdminAssetField } from "@/components/admin-asset-field";
import {
  AdminCheckbox,
  AdminDeleteButton,
  AdminField,
  AdminPageHeader,
  AdminSubmit,
  AdminTextarea,
  LocalizedFields,
  localized,
} from "@/components/admin-fields";
import { AdminSlugField } from "@/components/admin-slug-field";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminProductEditorData } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Products",
};

type ProductEditorData = Awaited<ReturnType<typeof getAdminProductEditorData>>;
type ProductRow = ProductEditorData["products"][number];
type ProductStatusFilter = "" | "published" | "hidden" | "featured" | "best_seller";
type ProductFiltersState = {
  q: string;
  category: string;
  brand: string;
  status: ProductStatusFilter;
};
type AdminProductsSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: AdminProductsSearchParams;
}) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};
  const data = await getAdminProductEditorData();
  const sizes = groupBy(data.sizes, (row) => row.product_id);
  const flavors = groupBy(data.flavors, (row) => row.product_id);
  const benefits = groupBy(data.benefits, (row) => row.product_id);
  const usage = groupBy(data.usage, (row) => row.product_id);
  const audiences = groupBy(data.audiences, (row) => row.product_id);
  const ingredients = groupBy(data.ingredients, (row) => row.product_id);
  const relatedProducts = groupBy(data.relatedProducts, (row) => row.product_id);
  const filters = getProductFilters(params);
  const filteredProducts = filterProducts(data.products, filters);

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Sản phẩm"
        description="Quản lý thông tin sản phẩm, giá, vị, công dụng, cách dùng và trạng thái hiển thị."
      />

      <details className="mt-6 rounded border border-line p-5">
        <summary className="cursor-pointer text-lg font-black">
          Thêm sản phẩm mới
        </summary>
        <ProductForm data={data} position={data.products.length + 1} />
      </details>

      <ProductFilters
        data={data}
        filters={filters}
        resultCount={filteredProducts.length}
        totalCount={data.products.length}
      />

      <div className="mt-8 grid gap-4">
        {filteredProducts.map((product) => {
          const position =
            data.products.findIndex((item) => item.id === product.id) + 1;

          return (
          <details key={product.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black">
              {localized(product.name, "vi")}{" "}
              <span className="text-sm font-semibold text-muted">
                / {product.slug} / {formatPrice(Number(product.price))}
              </span>
            </summary>
            <ProductForm
              data={data}
              product={product}
              sizes={sizes.get(product.id)}
              flavors={flavors.get(product.id)}
              benefits={benefits.get(product.id)}
              usage={usage.get(product.id)}
              audiences={audiences.get(product.id)}
              ingredients={ingredients.get(product.id)}
              relatedProducts={relatedProducts.get(product.id)}
              position={position}
            />
            <form action={deleteProduct} className="mt-4">
              <input type="hidden" name="id" value={product.id} />
              <AdminDeleteButton />
            </form>
          </details>
          );
        })}
        {!filteredProducts.length ? (
          <div className="rounded border border-dashed border-line p-8 text-center text-sm font-semibold text-muted">
            Khong co san pham nao khop voi bo loc hien tai.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProductFilters({
  data,
  filters,
  resultCount,
  totalCount,
}: {
  data: ProductEditorData;
  filters: ProductFiltersState;
  resultCount: number;
  totalCount: number;
}) {
  return (
    <form
      action="/admin/products"
      className="mt-6 grid gap-4 rounded border border-line bg-surface p-5"
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-black text-ink">Tim kiem va loc</h2>
          <p className="text-sm text-muted">
            Dang hien {resultCount}/{totalCount} san pham.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm font-black uppercase text-brand-red hover:text-red-700"
        >
          Xoa bo loc
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        <label className="grid gap-1.5 text-sm font-bold text-ink md:col-span-2">
          <span>Tu khoa</span>
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Ten san pham hoac slug"
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>Danh muc</span>
          <select
            name="category"
            defaultValue={filters.category}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="">Tat ca</option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {localized(category.name, "vi") || localized(category.name, "en")}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>Thuong hieu</span>
          <select
            name="brand"
            defaultValue={filters.brand}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="">Tat ca</option>
            {data.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>Trang thai</span>
          <select
            name="status"
            defaultValue={filters.status}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="">Tat ca</option>
            <option value="published">Dang xuat ban</option>
            <option value="hidden">Dang an</option>
            <option value="featured">Noi bat</option>
            <option value="best_seller">Ban chay</option>
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="h-10 rounded bg-ink px-4 text-sm font-black uppercase text-white hover:bg-slate-700 md:w-fit"
      >
        Ap dung bo loc
      </button>
    </form>
  );
}

function ProductForm({
  data,
  product,
  sizes = [],
  flavors = [],
  benefits = [],
  usage = [],
  audiences = [],
  ingredients = [],
  relatedProducts = [],
  position,
}: {
  data: ProductEditorData;
  product?: ProductRow;
  sizes?: ProductEditorData["sizes"];
  flavors?: ProductEditorData["flavors"];
  benefits?: ProductEditorData["benefits"];
  usage?: ProductEditorData["usage"];
  audiences?: ProductEditorData["audiences"];
  ingredients?: ProductEditorData["ingredients"];
  relatedProducts?: ProductEditorData["relatedProducts"];
  position: number;
}) {
  return (
    <form action={upsertProduct} className="mt-5 grid gap-5">
      <input type="hidden" name="id" value={product?.id ?? ""} />

      <ProductFormSection
        title="Thong tin co ban"
        description="Ten, mo ta, slug, gia va xuat xu san pham."
      >
      <LocalizedFields base="name" label="Tên" value={product?.name} />
      <LocalizedFields
        base="short_description"
        label="Mô tả ngắn"
        value={product?.short_description}
        textarea
      />
      <LocalizedFields
        base="primary_goal"
        label="Mục tiêu chính"
        value={product?.primary_goal}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <AdminSlugField sourceName="name_en" defaultValue={product?.slug} />
        <AdminField
          label="Giá"
          name="price"
          type="number"
          defaultValue={Number(product?.price ?? 0)}
          min={0}
        />
        <AdminField
          label="Tiền tệ"
          name="currency"
          defaultValue={product?.currency ?? "VND"}
        />
        <AdminField
          label="Xuất xứ"
          name="origin"
          defaultValue={product?.origin}
        />
      </div>
      </ProductFormSection>

      <ProductFormSection
        title="Phan loai va hien thi"
        description="Gan danh muc, thuong hieu, kieu visual va vi tri trong danh sach."
      >
      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>Danh mục</span>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="">Chưa chọn</option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {localized(category.name, "vi")}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>Thương hiệu</span>
          <select
            name="brand_id"
            defaultValue={product?.brand_id ?? ""}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="">Chưa chọn</option>
            {data.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>Kiểu visual</span>
          <select
            name="package_type"
            defaultValue={product?.package_type ?? "gel"}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="gel">gel</option>
            <option value="tube">tube</option>
            <option value="tub">tub</option>
            <option value="pouch">pouch</option>
          </select>
        </label>
        <AdminField
          label="Vị trí hiển thị"
          name="sort_order"
          type="number"
          defaultValue={position}
          min={1}
        />
      </div>
      </ProductFormSection>

      <ProductFormSection
        title="Anh va tai san"
        description="Upload anh san pham va bang nutrition. Neu de trong, website dung placeholder mac dinh."
      >
      <div className="grid gap-4 md:grid-cols-2">
        <AdminAssetField
          label="Image path"
          name="image_path"
          defaultValue={product?.image_path}
          folder="products"
          accept="image/*"
        />
        <AdminAssetField
          label="Nutrition image path"
          name="nutrition_image_path"
          defaultValue={product?.nutrition_image_path}
          folder="nutrition"
          accept="image/*"
        />
      </div>
      </ProductFormSection>

      <ProductFormSection
        title="Quy cach va trang thai"
        description="Nhap size, thanh phan va bat/tat cac trang thai hien thi."
      >
      <div className="grid gap-4 md:grid-cols-3">
        <AdminTextarea
          label="Sizes, mỗi dòng một size"
          name="sizes"
          defaultValue={sizes.map((row) => row.label).join("\n")}
        />
        <AdminTextarea
          label="Thành phần, dạng Tên|Hàm lượng"
          name="ingredients"
          defaultValue={ingredients
            .map((row) => `${row.name}|${row.amount}`)
            .join("\n")}
        />
        <div className="grid content-start gap-3 rounded border border-line p-4">
          <AdminCheckbox
            label="Nổi bật"
            name="is_featured"
            defaultChecked={product?.is_featured ?? false}
          />
          <AdminCheckbox
            label="Bán chạy"
            name="is_best_seller"
            defaultChecked={product?.is_best_seller ?? false}
          />
          <AdminCheckbox
            label="Đang xuất bản"
            name="is_published"
            defaultChecked={product?.is_published ?? true}
          />
        </div>
      </div>
      </ProductFormSection>

      <ProductFormSection
        title="Noi dung chi tiet"
        description="Nhap huong vi, cong dung, cach dung va doi tuong phu hop."
      >
      <LocalizedLineFields
        base="flavors"
        label="Vị, mỗi dòng một vị"
        viRows={flavors.map((row) => localized(row.name, "vi"))}
        enRows={flavors.map((row) => localized(row.name, "en"))}
      />
      <LocalizedLineFields
        base="benefits"
        label="Công dụng, mỗi dòng một ý"
        viRows={benefits.map((row) => localized(row.content, "vi"))}
        enRows={benefits.map((row) => localized(row.content, "en"))}
      />
      <LocalizedLineFields
        base="usage"
        label="Cách dùng, mỗi dòng một ý"
        viRows={usage.map((row) => localized(row.content, "vi"))}
        enRows={usage.map((row) => localized(row.content, "en"))}
      />
      <LocalizedLineFields
        base="audiences"
        label="Đối tượng phù hợp, mỗi dòng một ý"
        viRows={audiences.map((row) => localized(row.content, "vi"))}
        enRows={audiences.map((row) => localized(row.content, "en"))}
      />
      </ProductFormSection>

      <ProductFormSection
        title="San pham lien quan"
        description="Chon san pham se hien trong trang chi tiet cua san pham nay."
      >
      <RelatedProductsField
        currentProductId={product?.id}
        products={data.products}
        selectedIds={relatedProducts.map((row) => row.related_product_id)}
      />
      </ProductFormSection>

      <AdminSubmit />
    </form>
  );
}

function ProductFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-l-2 border-line pl-4">
      <div>
        <h3 className="text-base font-black text-ink">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function RelatedProductsField({
  currentProductId,
  products,
  selectedIds,
}: {
  currentProductId?: string;
  products: ProductEditorData["products"];
  selectedIds: string[];
}) {
  const selected = new Set(selectedIds);
  const options = products.filter((item) => item.id !== currentProductId);

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">San pham lien quan</legend>
      {options.length ? (
        <div className="grid max-h-64 gap-2 overflow-auto rounded border border-line bg-surface p-3 md:grid-cols-2">
          {options.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-2 rounded bg-white p-3 text-sm font-bold text-ink"
            >
              <input
                type="checkbox"
                name="related_product_ids"
                value={item.id}
                defaultChecked={selected.has(item.id)}
                className="mt-1 h-4 w-4 accent-brand-red"
              />
              <span>
                {localized(item.name, "vi") || localized(item.name, "en")}
                <span className="block text-xs font-semibold text-muted">
                  {item.slug}
                </span>
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="rounded border border-dashed border-line p-3 text-sm text-muted">
          Can co it nhat mot san pham khac de chon san pham lien quan.
        </p>
      )}
    </fieldset>
  );
}

function LocalizedLineFields({
  base,
  label,
  viRows,
  enRows,
}: {
  base: string;
  label: string;
  viRows: string[];
  enRows: string[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminTextarea
        label={`${label} VI`}
        name={`${base}_vi`}
        defaultValue={viRows.join("\n")}
        rows={4}
      />
      <AdminTextarea
        label={`${label} EN`}
        name={`${base}_en`}
        defaultValue={enRows.join("\n")}
        rows={4}
      />
    </div>
  );
}

function getProductFilters(
  params: Record<string, string | string[] | undefined>,
): ProductFiltersState {
  const status = getSingleParam(params.status);

  return {
    q: getSingleParam(params.q).toLowerCase(),
    category: getSingleParam(params.category),
    brand: getSingleParam(params.brand),
    status:
      status === "published" ||
      status === "hidden" ||
      status === "featured" ||
      status === "best_seller"
        ? status
        : "",
  };
}

function filterProducts(products: ProductRow[], filters: ProductFiltersState) {
  return products.filter((product) => {
    if (filters.category && product.category_id !== filters.category) {
      return false;
    }

    if (filters.brand && product.brand_id !== filters.brand) {
      return false;
    }

    if (filters.status === "published" && !product.is_published) {
      return false;
    }

    if (filters.status === "hidden" && product.is_published) {
      return false;
    }

    if (filters.status === "featured" && !product.is_featured) {
      return false;
    }

    if (filters.status === "best_seller" && !product.is_best_seller) {
      return false;
    }

    if (!filters.q) {
      return true;
    }

    const haystack = [
      localized(product.name, "vi"),
      localized(product.name, "en"),
      product.slug,
      product.origin ?? "",
      String(product.price),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(filters.q);
  });
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price);
}
