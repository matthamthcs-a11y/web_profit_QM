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

export const metadata: Metadata = {
  title: "Admin Brands",
};

export default async function AdminBrandsPage() {
  await requireAdmin();
  const brands = await getAdminBrands();

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Thương hiệu"
        description="Quản lý thương hiệu phân phối, xuất xứ và logo."
      />
      <details className="mt-6 rounded border border-line p-5" open>
        <summary className="cursor-pointer text-lg font-black">
          Thêm thương hiệu mới
        </summary>
        <BrandForm position={brands.length + 1} />
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
            <BrandForm brand={brand} position={index + 1} />
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
}: {
  brand?: Awaited<ReturnType<typeof getAdminBrands>>[number];
  position: number;
}) {
  return (
    <form action={upsertBrand} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={brand?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminField label="Tên" name="name" defaultValue={brand?.name} required />
        <AdminSlugField sourceName="name" defaultValue={brand?.slug} />
        <AdminField label="Xuất xứ" name="origin" defaultValue={brand?.origin} />
      </div>
      <LocalizedFields
        base="description"
        label="Mô tả"
        value={brand?.description}
        textarea
      />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminAssetField
          label="Logo path"
          name="logo_path"
          defaultValue={brand?.logo_path}
          folder="brands"
          accept="image/*"
        />
        <AdminField
          label="Vị trí hiển thị"
          name="sort_order"
          type="number"
          defaultValue={position}
          min={1}
        />
        <div className="flex items-end pb-2">
          <AdminCheckbox
            label="Đang hiển thị"
            name="is_active"
            defaultChecked={brand?.is_active ?? true}
          />
        </div>
      </div>
      <AdminSubmit />
    </form>
  );
}
