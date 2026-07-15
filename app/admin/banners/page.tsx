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
import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin Banners",
};

const copy = {
  vi: {
    eyebrow: "Home",
    title: "Banner trang chủ",
    description:
      "Quản lý các ảnh slide hero. Chữ nếu có nên nằm sẵn trong file ảnh.",
    addNew: "Thêm banner mới",
    image: "Ảnh banner",
    mobileImage: "Ảnh banner mobile",
    altText: "Mô tả ảnh",
    linkUrl: "Link khi bấm vào banner",
    sortOrder: "Vị trí hiển thị",
    active: "Đang hiển thị",
    save: "Lưu",
    delete: "Xóa banner",
    confirmDelete: "Bạn có chắc muốn xóa banner này không?",
  },
  en: {
    eyebrow: "Home",
    title: "Homepage banners",
    description:
      "Manage hero slider images. Any text should be designed inside the image file.",
    addNew: "Add new banner",
    image: "Banner image",
    mobileImage: "Mobile banner image",
    altText: "Image description",
    linkUrl: "Banner click link",
    sortOrder: "Display position",
    active: "Visible",
    save: "Save",
    delete: "Delete banner",
    confirmDelete: "Are you sure you want to delete this banner?",
  },
} as const;

export default async function AdminBannersPage() {
  await requireAdmin();
  const [banners, locale] = await Promise.all([getAdminBanners(), getLocale()]);
  const t = copy[locale];

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
        <BannerForm position={banners.length + 1} locale={locale} />
      </details>
      <div className="mt-8 grid gap-4">
        {banners.map((banner, index) => (
          <details key={banner.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black">
              {localized(banner.alt, locale) || banner.image_path}
            </summary>
            <BannerForm banner={banner} position={index + 1} locale={locale} />
            <form action={deleteBanner} className="mt-4">
              <input type="hidden" name="id" value={banner.id} />
              <AdminDeleteButton label={t.delete} message={t.confirmDelete} />
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
  locale,
}: {
  banner?: Awaited<ReturnType<typeof getAdminBanners>>[number];
  position: number;
  locale: Locale;
}) {
  const t = copy[locale];

  return (
    <form action={upsertBanner} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={banner?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <AdminAssetField
          label={t.image}
          name="image_path"
          defaultValue={banner?.image_path}
          folder="banners"
          accept="image/*"
          required
          locale={locale}
        />
        <AdminAssetField
          label={t.mobileImage}
          name="mobile_image_path"
          defaultValue={banner?.mobile_image_path}
          folder="banners-mobile"
          accept="image/*"
          locale={locale}
        />
      </div>
      <LocalizedFields base="alt" label={t.altText} value={banner?.alt} />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminField
          label={t.linkUrl}
          name="link_url"
          defaultValue={banner?.link_url}
        />
        <AdminField
          label={t.sortOrder}
          name="sort_order"
          type="number"
          defaultValue={position}
          min={1}
        />
        <div className="flex items-end pb-2">
          <AdminCheckbox
            label={t.active}
            name="is_active"
            defaultChecked={banner?.is_active ?? true}
          />
        </div>
      </div>
      <AdminSubmit label={t.save} />
    </form>
  );
}
