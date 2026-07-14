import type { Metadata } from "next";
import { deleteBanner, upsertBanner } from "@/app/admin/actions";
import { AdminAssetField } from "@/components/admin-asset-field";
import {
  AdminCheckbox,
  AdminDeleteButton,
  AdminField,
  AdminPageHeader,
  AdminSubmit,
  LocalizedFields,
  localized,
} from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminBanners } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Banners",
};

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await getAdminBanners();

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Home"
        title="Banner trang chủ"
        description="Quản lý các ảnh slide hero. Chữ nếu có nên nằm sẵn trong file ảnh."
      />
      <details className="mt-6 rounded border border-line p-5" open>
        <summary className="cursor-pointer text-lg font-black">
          Thêm banner mới
        </summary>
        <BannerForm position={banners.length + 1} />
      </details>
      <div className="mt-8 grid gap-4">
        {banners.map((banner, index) => (
          <details key={banner.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black">
              {localized(banner.alt, "vi") || banner.image_path}
            </summary>
            <BannerForm banner={banner} position={index + 1} />
            <form action={deleteBanner} className="mt-4">
              <input type="hidden" name="id" value={banner.id} />
              <AdminDeleteButton />
            </form>
          </details>
        ))}
      </div>
    </section>
  );
}

function BannerForm({
  banner,
  position,
}: {
  banner?: Awaited<ReturnType<typeof getAdminBanners>>[number];
  position: number;
}) {
  return (
    <form action={upsertBanner} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={banner?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <AdminAssetField
          label="Image path"
          name="image_path"
          defaultValue={banner?.image_path}
          folder="banners"
          accept="image/*"
          required
        />
        <AdminAssetField
          label="Mobile image path"
          name="mobile_image_path"
          defaultValue={banner?.mobile_image_path}
          folder="banners-mobile"
          accept="image/*"
        />
      </div>
      <LocalizedFields base="alt" label="Alt text" value={banner?.alt} />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminField
          label="Link URL"
          name="link_url"
          defaultValue={banner?.link_url}
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
            defaultChecked={banner?.is_active ?? true}
          />
        </div>
      </div>
      <AdminSubmit />
    </form>
  );
}
