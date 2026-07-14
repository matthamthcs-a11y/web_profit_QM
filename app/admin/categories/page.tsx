import type { Metadata } from "next";
import {
  deleteCategory,
  upsertCategory,
} from "@/app/admin/actions";
import {
  AdminCheckbox,
  AdminDeleteButton,
  AdminField,
  AdminPageHeader,
  AdminSubmit,
  LocalizedFields,
  localized,
} from "@/components/admin-fields";
import { AdminSlugField } from "@/components/admin-slug-field";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminCategories } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getAdminCategories();

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Danh mục sản phẩm"
        description="Quản lý nhóm sản phẩm cho dropdown, bộ lọc và section danh mục nổi bật."
      />

      <details className="mt-6 rounded border border-line p-5" open>
        <summary className="cursor-pointer text-lg font-black">
          Thêm danh mục mới
        </summary>
        <CategoryForm position={categories.length + 1} />
      </details>

      <div className="mt-8 grid gap-4">
        {categories.map((category, index) => (
          <details key={category.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black">
              {localized(category.name, "vi")}{" "}
              <span className="text-sm font-semibold text-muted">
                / {category.slug}
              </span>
            </summary>
            <CategoryForm category={category} position={index + 1} />
            <form action={deleteCategory} className="mt-4">
              <input type="hidden" name="id" value={category.id} />
              <AdminDeleteButton />
            </form>
          </details>
        ))}
      </div>
    </section>
  );
}

function CategoryForm({
  category,
  position,
}: {
  category?: Awaited<ReturnType<typeof getAdminCategories>>[number];
  position: number;
}) {
  return (
    <form action={upsertCategory} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <LocalizedFields base="name" label="Tên" value={category?.name} />
      <LocalizedFields
        base="description"
        label="Mô tả"
        value={category?.description}
        textarea
      />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminSlugField sourceName="name_en" defaultValue={category?.slug} />
        <AdminField
          label="Vị trí hiển thị"
          name="sort_order"
          type="number"
          defaultValue={position}
          min={1}
        />
        <div className="flex items-end gap-4 pb-2">
          <AdminCheckbox
            label="Nổi bật"
            name="is_featured"
            defaultChecked={category?.is_featured ?? false}
          />
          <AdminCheckbox
            label="Đang hiển thị"
            name="is_active"
            defaultChecked={category?.is_active ?? true}
          />
        </div>
      </div>
      <AdminSubmit />
    </form>
  );
}
