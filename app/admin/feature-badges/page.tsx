import type { Metadata } from "next";
import { deleteFeatureBadge, upsertFeatureBadge } from "@/app/admin/actions";
import { AdminAssetField } from "@/components/admin-asset-field";
import {
  AdminCheckbox,
  AdminDeleteButton,
  AdminPageHeader,
  AdminSubmit,
} from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminFeatureBadges } from "@/lib/admin/data";
import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin Feature Badges",
};

type FeatureBadgeCopy = (typeof featureBadgeCopy)[Locale];

const featureBadgeCopy = {
  vi: {
    eyebrow: "Catalog",
    title: "Thư viện huy hiệu",
    description: "Quản lý thư viện các huy hiệu tính năng (GMP, Made in USA...) dùng chung cho sản phẩm.",
    addNew: "Thêm huy hiệu mới",
    fields: {
      name: "Tên hiển thị",
      image: "Hình ảnh huy hiệu",
      sortOrder: "Vị trí hiển thị",
      active: "Đang hiển thị",
    },
  },
  en: {
    eyebrow: "Catalog",
    title: "Feature Badges",
    description: "Manage global feature badges library (GMP, Made in USA...) for products.",
    addNew: "Add new badge",
    fields: {
      name: "Display name",
      image: "Badge image",
      sortOrder: "Display position",
      active: "Visible",
    },
  },
} as const;

export default async function AdminFeatureBadgesPage() {
  await requireAdmin();
  const [badges, locale] = await Promise.all([getAdminFeatureBadges(), getLocale()]);
  const t = featureBadgeCopy[locale];

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
        <FeatureBadgeForm locale={locale} t={t} />
      </details>
      <div className="mt-8 grid gap-4">
        {badges.map((badge, index) => (
          <details key={badge.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black flex items-center gap-4">
              {badge.image_path ? (
                <div className="rounded border border-line bg-slate-50 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={badge.image_path} alt="" className="h-10 w-auto object-contain" />
                </div>
              ) : (
                <span>Huy hiệu {index + 1}</span>
              )}
            </summary>
            <FeatureBadgeForm badge={badge} locale={locale} t={t} />
            <form action={deleteFeatureBadge} className="mt-4">
              <input type="hidden" name="id" value={badge.id} />
              <AdminDeleteButton />
            </form>
          </details>
        ))}
      </div>
    </section>
  );
}

function FeatureBadgeForm({
  badge,
  locale,
  t,
}: {
  badge?: Awaited<ReturnType<typeof getAdminFeatureBadges>>[number];
  locale: Locale;
  t: FeatureBadgeCopy;
}) {
  return (
    <form action={upsertFeatureBadge} className="mt-5 grid gap-5">
      <input type="hidden" name="id" value={badge?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <AdminAssetField
          label={t.fields.image}
          name="image_path"
          defaultValue={badge?.image_path}
          folder="badges"
          accept="image/*"
          locale={locale}
        />
        <div className="flex items-center">
          <AdminCheckbox
            label={t.fields.active}
            name="is_active"
            defaultChecked={badge?.is_active ?? true}
          />
        </div>
      </div>
      <AdminSubmit />
    </form>
  );
}
