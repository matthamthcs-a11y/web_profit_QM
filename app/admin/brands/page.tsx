import type { Metadata } from "next";
import { deleteBrand, upsertBrand } from "@/app/admin/actions";
import { AdminAssetField } from "@/components/admin-asset-field";
import {
  AdminCheckbox,
  AdminDeleteButton,
  AdminField,
  AdminPageHeader,
  AdminSubmit,
  LocalizedFields,
} from "@/components/admin-fields";
import { AdminSlugField } from "@/components/admin-slug-field";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminBrands } from "@/lib/admin/data";
import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin Brands",
};

type BrandCopy = (typeof brandCopy)[Locale];

const brandCopy = {
  vi: {
    eyebrow: "Catalog",
    title: "Thương hiệu",
    description: "Quản lý thương hiệu phân phối, xuất xứ và logo.",
    addNew: "Thêm thương hiệu mới",
    fields: {
      name: "Tên",
      origin: "Xuất xứ",
      description: "Mô tả",
      logo: "Logo thương hiệu",
      sortOrder: "Vị trí hiển thị",
      active: "Đang hiển thị",
    },
  },
  en: {
    eyebrow: "Catalog",
    title: "Brands",
    description: "Manage distributed brands, origin and logo.",
    addNew: "Add new brand",
    fields: {
      name: "Name",
      origin: "Origin",
      description: "Description",
      logo: "Brand logo",
      sortOrder: "Display position",
      active: "Visible",
    },
  },
} as const;

export default async function AdminBrandsPage() {
  await requireAdmin();
  const [brands, locale] = await Promise.all([getAdminBrands(), getLocale()]);
  const t = brandCopy[locale];

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />
      <details className="mt-6 rounded border border-line p-5" open>
        <summary className="cursor-pointer text-lg font-black">
          {t.addNew}
        </summary>
        <BrandForm position={brands.length + 1} locale={locale} t={t} />
      </details>
      <div className="mt-8 grid gap-4">
        {brands.map((brand, index) => (
          <details key={brand.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black">
              {brand.name}{" "}
              <span className="text-sm font-semibold text-muted">
                / {brand.slug}
              </span>
            </summary>
            <BrandForm brand={brand} position={index + 1} locale={locale} t={t} />
            <form action={deleteBrand} className="mt-4">
              <input type="hidden" name="id" value={brand.id} />
              <AdminDeleteButton />
            </form>
          </details>
        ))}
      </div>
    </section>
  );
}

function BrandForm({
  brand,
  position,
  locale,
  t,
}: {
  brand?: Awaited<ReturnType<typeof getAdminBrands>>[number];
  position: number;
  locale: Locale;
  t: BrandCopy;
}) {
  return (
    <form action={upsertBrand} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={brand?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminField label={t.fields.name} name="name" defaultValue={brand?.name} required />
        <AdminSlugField sourceName="name" defaultValue={brand?.slug} />
        <AdminField label={t.fields.origin} name="origin" defaultValue={brand?.origin} />
      </div>
      <LocalizedFields
        base="description"
        label={t.fields.description}
        value={brand?.description}
        textarea
      />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminAssetField
          label={t.fields.logo}
          name="logo_path"
          defaultValue={brand?.logo_path}
          folder="brands"
          accept="image/*"
          locale={locale}
        />
        <AdminField
          label={t.fields.sortOrder}
          name="sort_order"
          type="number"
          defaultValue={position}
          min={1}
        />
        <div className="flex items-end pb-2">
          <AdminCheckbox
            label={t.fields.active}
            name="is_active"
            defaultChecked={brand?.is_active ?? true}
          />
        </div>
      </div>
      <AdminSubmit />
    </form>
  );
}