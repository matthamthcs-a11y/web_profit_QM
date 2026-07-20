import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { deleteProduct, upsertProduct } from "@/app/admin/actions";
import { AdminAssetField } from "@/components/admin-asset-field";
import { AdminProductVariantsField } from "@/components/admin-product-variants-field";
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
import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

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
type ProductCopy = (typeof adminProductCopy)[Locale];

const adminProductCopy = {
  vi: {
    page: {
      eyebrow: "Catalog",
      title: "Sản phẩm",
      description:
        "Quản lý thông tin sản phẩm, giá, hương vị, quy cách, công dụng, cách dùng và trạng thái hiển thị.",
      addNew: "Thêm sản phẩm mới",
      empty: "Không có sản phẩm nào khớp với bộ lọc hiện tại.",
      delete: "Xóa sản phẩm",
      confirmDelete: "Bạn có chắc muốn xóa sản phẩm này không?",
      edit: "Sửa",
      cancelEdit: "Đóng form sửa",
    },
    filters: {
      title: "Tìm kiếm và lọc",
      count: (shown: number, total: number) => `Đang hiển thị ${shown}/${total} sản phẩm.`,
      clear: "Xóa bộ lọc",
      keyword: "Từ khóa",
      keywordPlaceholder: "Tên sản phẩm hoặc slug",
      category: "Danh mục",
      brand: "Thương hiệu",
      status: "Trạng thái",
      all: "Tất cả",
      published: "Đang hiển thị",
      hidden: "Đang ẩn",
      featured: "Nổi bật",
      bestSeller: "Bán chạy",
      submit: "Áp dụng bộ lọc",
    },
    form: {
      sections: {
        basic: {
          title: "Thông tin cố định",
          description: "Tên, mô tả, slug, giá mặc định, tiền tệ và xuất xứ sản phẩm.",
        },
        taxonomy: {
          title: "Phân loại và thứ tự hiển thị",
          description: "Chọn danh mục, thương hiệu và vị trí sắp xếp trong danh sách.",
        },
        assets: {
          title: "Ảnh sản phẩm",
          description:
            "Upload ảnh chính của sản phẩm và ảnh bảng thành phần dùng chung. Nếu để trống, website sẽ dùng ảnh mặc định.",
        },
        specs: {
          title: "Trạng thái hiển thị",
          description: "Bật hoặc tắt các trạng thái hiển thị của sản phẩm.",
        },
        content: {
          title: "Thông tin mô tả chi tiết",
          description: "Nhập công dụng, cách sử dụng và đối tượng phù hợp.",
        },
        variants: {
          title: "Biến thể sản phẩm",
          description:
            "Nhập hương vị và quy cách, sau đó tạo tổ hợp biến thể. Mỗi tổ hợp có thể có giá và ảnh riêng.",
        },
        related: {
          title: "Sản phẩm liên quan",
          description: "Chọn sản phẩm sẽ hiển thị trong trang chi tiết của sản phẩm này.",
        },
      },
      fields: {
        name: "Tên sản phẩm",
        shortDescription: "Mô tả ngắn",
        slug: "Slug",
        price: "Giá mặc định",
        currency: "Tiền tệ",
        origin: "Xuất xứ",
        category: "Danh mục",
        brand: "Thương hiệu",
        sortOrder: "Vị trí hiển thị",
        productImage: "Ảnh chính sản phẩm",
        nutritionImage: "Ảnh bảng thành phần",
        sizes: "Quy cách, mỗi dòng một quy cách",
        featured: "Nổi bật trên trang chủ",
        bestSeller: "Sản phẩm bán chạy",
        published: "Đang hiển thị trên website",
        flavors: "Hương vị, mỗi dòng một hương vị",
        benefits: "Công dụng, mỗi dòng một ý",
        usage: "Cách sử dụng, mỗi dòng một ý",
        audiences: "Đối tượng phù hợp, mỗi dòng một ý",
        variantPrice: "Giá riêng của biến thể",
        variantImage: "Ảnh riêng của biến thể",
        variantPublished: "Hiển thị biến thể",
        variantDefault: "Biến thể mặc định",
        variantInputsTitle: "Nhập hương vị và quy cách",
        variantListTitle: "Tổ hợp biến thể cần nhập",
        variantCreate: "Tạo tổ hợp",
      },
      placeholders: {
        notSelected: "Chưa chọn",
        slug: "tu-dong-tao-tu-ten-en",
      },
      help: {
        slug: "Tự tạo từ tên tiếng Anh. Có thể sửa thủ công nếu cần.",
        noRelated: "Cần có ít nhất một sản phẩm khác để chọn sản phẩm liên quan.",
        variantsAfterSave:
          "Nhập hương vị và quy cách, bấm Tạo tổ hợp, sau đó nhập giá và ảnh cho từng biến thể.",
        variantFallback:
          "Nếu để trống giá hoặc ảnh, website sẽ dùng giá và ảnh mặc định ở phần thông tin cố định.",
      },
      actions: {
        save: "Lưu",
      },
    },
  },
  en: {
    page: {
      eyebrow: "Catalog",
      title: "Products",
      description:
        "Manage product information, price, flavors, sizes, benefits, usage and display status.",
      addNew: "Add new product",
      empty: "No products match the current filters.",
      delete: "Delete product",
      confirmDelete: "Are you sure you want to delete this product?",
      edit: "Edit",
      cancelEdit: "Close editor",
    },
    filters: {
      title: "Search and filters",
      count: (shown: number, total: number) => `Showing ${shown}/${total} products.`,
      clear: "Clear filters",
      keyword: "Keyword",
      keywordPlaceholder: "Product name or slug",
      category: "Category",
      brand: "Brand",
      status: "Status",
      all: "All",
      published: "Visible",
      hidden: "Hidden",
      featured: "Featured",
      bestSeller: "Best seller",
      submit: "Apply filters",
    },
    form: {
      sections: {
        basic: {
          title: "Fixed product information",
          description: "Product name, description, slug, default price, currency and origin.",
        },
        taxonomy: {
          title: "Classification and display order",
          description: "Choose category, brand and sorting position.",
        },
        assets: {
          title: "Product images",
          description:
            "Upload the main product image and the shared nutrition facts image. If empty, the website uses the default placeholder.",
        },
        specs: {
          title: "Display status",
          description: "Toggle how this product appears on the website.",
        },
        content: {
          title: "Detailed product content",
          description: "Enter benefits, usage instructions and suitable audience.",
        },
        variants: {
          title: "Product variants",
          description:
            "Enter flavors and sizes, then generate variant combinations. Each combination can have its own price and product image.",
        },
        related: {
          title: "Related products",
          description: "Choose products shown on this product detail page.",
        },
      },
      fields: {
        name: "Product name",
        shortDescription: "Short description",
        slug: "Slug",
        price: "Default price",
        currency: "Currency",
        origin: "Origin",
        category: "Category",
        brand: "Brand",
        sortOrder: "Display position",
        productImage: "Main product image",
        nutritionImage: "Nutrition facts image",
        sizes: "Sizes, one per line",
        featured: "Featured on homepage",
        bestSeller: "Best-selling product",
        published: "Visible on website",
        flavors: "Flavors, one per line",
        benefits: "Benefits, one per line",
        usage: "Usage instructions, one per line",
        audiences: "Suitable audience, one per line",
        variantPrice: "Variant-specific price",
        variantImage: "Variant-specific image",
        variantPublished: "Show this variant",
        variantDefault: "Default variant",
        variantInputsTitle: "Enter flavors and sizes",
        variantListTitle: "Variant combinations to complete",
        variantCreate: "Generate combinations",
      },
      placeholders: {
        notSelected: "Not selected",
        slug: "auto-generated-from-en-name",
      },
      help: {
        slug: "Generated from the English name. You can edit it manually if needed.",
        noRelated: "At least one other product is required to choose related products.",
        variantsAfterSave:
          "Enter flavors and sizes, generate combinations, then add price and image for each variant.",
        variantFallback:
          "Empty price or image fields use the fixed product price and product image above.",
      },
      actions: {
        save: "Save",
      },
    },
  },
} as const;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: AdminProductsSearchParams;
}) {
  await requireAdmin();
  const [locale, params] = await Promise.all([
    getLocale(),
    searchParams
      ? searchParams
      : Promise.resolve({} as Record<string, string | string[] | undefined>),
  ]);
  const editProductId = getSingleParam(params.edit);
  const data = await getAdminProductEditorData(editProductId);
  const t = adminProductCopy[locale];
  const sizes = groupBy(data.sizes, (row) => row.product_id);
  const flavors = groupBy(data.flavors, (row) => row.product_id);
  const benefits = groupBy(data.benefits, (row) => row.product_id);
  const usage = groupBy(data.usage, (row) => row.product_id);
  const audiences = groupBy(data.audiences, (row) => row.product_id);
  const variants = groupBy(data.variants, (row) => row.product_id);
  const relatedProducts = groupBy(data.relatedProducts, (row) => row.product_id);
  const filters = getProductFilters(params);
  const filteredProducts = filterProducts(data.products, filters);

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow={t.page.eyebrow}
        title={t.page.title}
        description={t.page.description}
      />

      <details className="mt-6 rounded border border-line p-5">
        <summary className="cursor-pointer text-lg font-black">
          {t.page.addNew}
        </summary>
        <ProductForm
          data={data}
          locale={locale}
          t={t}
          position={data.products.length + 1}
        />
      </details>

      <ProductFilters
        data={data}
        filters={filters}
        resultCount={filteredProducts.length}
        totalCount={data.products.length}
        locale={locale}
        t={t}
      />

      <div className="mt-8 grid gap-4">
        {filteredProducts.map((product) => {
          const position =
            data.products.findIndex((item) => item.id === product.id) + 1;
          const isEditing = editProductId === product.id;

          return (
            <article key={product.id} className="rounded border border-line p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="font-black">
                  {localized(product.name, locale)}{" "}
                  <span className="text-sm font-semibold text-muted">
                    / {product.slug} / {formatPrice(Number(product.price), locale)}
                  </span>
                </div>
                <Link
                  href={isEditing ? "/admin/products" : `/admin/products?edit=${product.id}`}
                  className="inline-flex h-9 items-center justify-center rounded border border-line px-4 text-xs font-black uppercase text-ink hover:border-brand-red hover:text-brand-red"
                >
                  {isEditing ? t.page.cancelEdit : t.page.edit}
                </Link>
              </div>

              {isEditing ? (
                <>
                  <ProductForm
                    data={data}
                    product={product}
                    sizes={sizes.get(product.id)}
                    flavors={flavors.get(product.id)}
                    benefits={benefits.get(product.id)}
                    usage={usage.get(product.id)}
                    audiences={audiences.get(product.id)}
                    variants={variants.get(product.id)}
                    relatedProducts={relatedProducts.get(product.id)}
                    position={position}
                    locale={locale}
                    t={t}
                  />
                  <form action={deleteProduct} className="mt-4">
                    <input type="hidden" name="id" value={product.id} />
                    <AdminDeleteButton
                      label={t.page.delete}
                      message={t.page.confirmDelete}
                    />
                  </form>
                </>
              ) : null}
            </article>
          );
        })}
        {!filteredProducts.length ? (
          <div className="rounded border border-dashed border-line p-8 text-center text-sm font-semibold text-muted">
            {t.page.empty}
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
  locale,
  t,
}: {
  data: ProductEditorData;
  filters: ProductFiltersState;
  resultCount: number;
  totalCount: number;
  locale: Locale;
  t: ProductCopy;
}) {
  return (
    <form
      action="/admin/products"
      className="mt-6 grid gap-4 rounded border border-line bg-surface p-5"
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-black text-ink">{t.filters.title}</h2>
          <p className="text-sm text-muted">
            {t.filters.count(resultCount, totalCount)}
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm font-black uppercase text-brand-red hover:text-red-700"
        >
          {t.filters.clear}
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        <label className="grid gap-1.5 text-sm font-bold text-ink md:col-span-2">
          <span>{t.filters.keyword}</span>
          <input
            name="q"
            defaultValue={filters.q}
            placeholder={t.filters.keywordPlaceholder}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>{t.filters.category}</span>
          <select
            name="category"
            defaultValue={filters.category}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="">{t.filters.all}</option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {localized(category.name, locale) || localized(category.name, "vi")}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>{t.filters.brand}</span>
          <select
            name="brand"
            defaultValue={filters.brand}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="">{t.filters.all}</option>
            {data.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>{t.filters.status}</span>
          <select
            name="status"
            defaultValue={filters.status}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="">{t.filters.all}</option>
            <option value="published">{t.filters.published}</option>
            <option value="hidden">{t.filters.hidden}</option>
            <option value="featured">{t.filters.featured}</option>
            <option value="best_seller">{t.filters.bestSeller}</option>
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="h-10 rounded bg-ink px-4 text-sm font-black uppercase text-white hover:bg-slate-700 md:w-fit"
      >
        {t.filters.submit}
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
  variants = [],
  relatedProducts = [],
  position,
  locale,
  t,
}: {
  data: ProductEditorData;
  product?: ProductRow;
  sizes?: ProductEditorData["sizes"];
  flavors?: ProductEditorData["flavors"];
  benefits?: ProductEditorData["benefits"];
  usage?: ProductEditorData["usage"];
  audiences?: ProductEditorData["audiences"];
  variants?: ProductEditorData["variants"];
  relatedProducts?: ProductEditorData["relatedProducts"];
  position: number;
  locale: Locale;
  t: ProductCopy;
}) {
  return (
    <form action={upsertProduct} className="mt-5 grid gap-5">
      <input type="hidden" name="id" value={product?.id ?? ""} />

      <ProductFormSection
        title={t.form.sections.basic.title}
        description={t.form.sections.basic.description}
      >
        <LocalizedFields base="name" label={t.form.fields.name} value={product?.name} />
        <LocalizedFields
          base="short_description"
          label={t.form.fields.shortDescription}
          value={product?.short_description}
          textarea
        />
        <input
          type="hidden"
          name="primary_goal_vi"
          value={localized(product?.primary_goal, "vi")}
        />
        <input
          type="hidden"
          name="primary_goal_en"
          value={localized(product?.primary_goal, "en")}
        />

        <input
          type="hidden"
          name="package_type"
          value={product?.package_type ?? "gel"}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <AdminSlugField
            label={t.form.fields.slug}
            sourceName="name_en"
            defaultValue={product?.slug}
            placeholder={t.form.placeholders.slug}
            helpText={t.form.help.slug}
          />
          <AdminField
            label={t.form.fields.price}
            name="price"
            type="number"
            defaultValue={Number(product?.price ?? 0)}
            min={0}
          />
          <AdminField
            label={t.form.fields.currency}
            name="currency"
            defaultValue={product?.currency ?? "VND"}
          />
          <AdminField
            label={t.form.fields.origin}
            name="origin"
            defaultValue={product?.origin}
          />
        </div>
      </ProductFormSection>

      <ProductFormSection
        title={t.form.sections.taxonomy.title}
        description={t.form.sections.taxonomy.description}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span>{t.form.fields.category}</span>
            <select
              name="category_id"
              defaultValue={product?.category_id ?? ""}
              className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            >
              <option value="">{t.form.placeholders.notSelected}</option>
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {localized(category.name, locale) || localized(category.name, "vi")}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span>{t.form.fields.brand}</span>
            <select
              name="brand_id"
              defaultValue={product?.brand_id ?? ""}
              className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            >
              <option value="">{t.form.placeholders.notSelected}</option>
              {data.brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <AdminField
            label={t.form.fields.sortOrder}
            name="sort_order"
            type="number"
            defaultValue={position}
            min={1}
          />
        </div>
      </ProductFormSection>

      <ProductFormSection
        title={t.form.sections.assets.title}
        description={t.form.sections.assets.description}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AdminAssetField
            label={t.form.fields.productImage}
            name="image_path"
            defaultValue={product?.image_path}
            folder="products"
            accept="image/*"
            locale={locale}
          />
          <AdminAssetField
            label={t.form.fields.nutritionImage}
            name="nutrition_image_path"
            defaultValue={product?.nutrition_image_path}
            folder="nutrition"
            accept="image/*"
            locale={locale}
          />
        </div>
      </ProductFormSection>

      <ProductFormSection
        title={t.form.sections.specs.title}
        description={t.form.sections.specs.description}
      >
        <div className="grid content-start gap-3 rounded border border-line p-4 md:max-w-md">
          <AdminCheckbox
            label={t.form.fields.featured}
            name="is_featured"
            defaultChecked={product?.is_featured ?? false}
          />
          <AdminCheckbox
            label={t.form.fields.bestSeller}
            name="is_best_seller"
            defaultChecked={product?.is_best_seller ?? false}
          />
          <AdminCheckbox
            label={t.form.fields.published}
            name="is_published"
            defaultChecked={product?.is_published ?? true}
          />
        </div>
      </ProductFormSection>

      <ProductFormSection
        title={t.form.sections.content.title}
        description={t.form.sections.content.description}
      >
        <LocalizedLineFields
          base="benefits"
          label={t.form.fields.benefits}
          viRows={benefits.map((row) => localized(row.content, "vi"))}
          enRows={benefits.map((row) => localized(row.content, "en"))}
        />
        <LocalizedLineFields
          base="usage"
          label={t.form.fields.usage}
          viRows={usage.map((row) => localized(row.content, "vi"))}
          enRows={usage.map((row) => localized(row.content, "en"))}
        />
        <LocalizedLineFields
          base="audiences"
          label={t.form.fields.audiences}
          viRows={audiences.map((row) => localized(row.content, "vi"))}
          enRows={audiences.map((row) => localized(row.content, "en"))}
        />
      </ProductFormSection>

      <ProductFormSection
        title={t.form.sections.variants.title}
        description={t.form.sections.variants.description}
      >
        <AdminProductVariantsField
          sizes={sizes}
          flavors={flavors}
          variants={variants}
          locale={locale}
          copy={{
            inputsTitle: t.form.fields.variantInputsTitle,
            listTitle: t.form.fields.variantListTitle,
            flavorsLabel: t.form.fields.flavors,
            sizesLabel: t.form.fields.sizes,
            createButton: t.form.fields.variantCreate,
            empty: t.form.help.variantsAfterSave,
            fallback: t.form.help.variantFallback,
            price: t.form.fields.variantPrice,
            image: t.form.fields.variantImage,
            defaultVariant: t.form.fields.variantDefault,
            published: t.form.fields.variantPublished,
          }}
        />
      </ProductFormSection>

      <ProductFormSection
        title={t.form.sections.related.title}
        description={t.form.sections.related.description}
      >
        <RelatedProductsField
          currentProductId={product?.id}
          products={data.products}
          selectedIds={relatedProducts.map((row) => row.related_product_id)}
          locale={locale}
          noOptionsText={t.form.help.noRelated}
        />
      </ProductFormSection>

      <AdminSubmit label={t.form.actions.save} />
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
  locale,
  noOptionsText,
}: {
  currentProductId?: string;
  products: ProductEditorData["products"];
  selectedIds: string[];
  locale: Locale;
  noOptionsText: string;
}) {
  const selected = new Set(selectedIds);
  const options = products.filter((item) => item.id !== currentProductId);

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Related products</legend>
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
                {localized(item.name, locale) || localized(item.name, "vi")}
                <span className="block text-xs font-semibold text-muted">
                  {item.slug}
                </span>
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="rounded border border-dashed border-line p-3 text-sm text-muted">
          {noOptionsText}
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

function formatPrice(price: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(price);
}

