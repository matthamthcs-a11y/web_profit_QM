import type { Metadata } from "next";
import { updateSiteSettings } from "@/app/admin/actions";
import {
  AdminField,
  AdminPageHeader,
  AdminSubmit,
} from "@/components/admin-fields";
import { AdminAssetField } from "@/components/admin-asset-field";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSettings } from "@/lib/admin/data";
import { getLocale } from "@/lib/i18n";
import type { Json } from "@/lib/supabase/database.types";

export const metadata: Metadata = {
  title: "Admin Settings",
};

export default async function AdminSettingsPage() {
  await requireAdmin();
  const [rows, locale] = await Promise.all([getAdminSettings(), getLocale()]);
  const contact = objectValue(rows.find((row) => row.key === "contact")?.value);
  const social = objectValue(
    rows.find((row) => row.key === "social_links")?.value,
  );
  const seo = objectValue(rows.find((row) => row.key === "seo")?.value);
  const appearance = objectValue(
    rows.find((row) => row.key === "appearance")?.value,
  );

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Website"
        title="Cài đặt chung"
        description="Cập nhật hotline, Zalo, email, địa chỉ và SEO cơ bản."
      />
      <form action={updateSiteSettings} className="mt-8 grid gap-5">
        <div className="rounded border border-line p-5">
          <AdminAssetField
            label="Logo thanh điều hướng"
            name="logo_path"
            defaultValue={stringValue(appearance.logo_path)}
            folder="logos"
            accept="image/*"
            locale={locale}
            optimizeImage={{ maxWidth: 660, maxHeight: 128, quality: 0.88 }}
          />
          <p className="mt-2 text-xs font-semibold leading-5 text-muted">
            Logo sẽ tự chuyển sang WebP và nằm trong khung cố định giống logo
            hiện tại. Nếu để trống, website dùng logo mặc định.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField
            label="Hotline"
            name="hotline"
            defaultValue={stringValue(contact.hotline)}
          />
          <AdminField
            label="Email"
            name="email"
            defaultValue={stringValue(contact.email)}
          />
          <AdminField
            label="Zalo URL"
            name="zalo_url"
            defaultValue={stringValue(contact.zalo_url)}
          />
          <AdminField
            label="Địa chỉ"
            name="address"
            defaultValue={stringValue(contact.address)}
          />
          <AdminField
            label="Facebook label"
            name="facebook_label"
            defaultValue={stringValue(social.facebook_label)}
          />
          <AdminField
            label="Facebook URL"
            name="facebook_url"
            defaultValue={stringValue(social.facebook_url)}
          />
          <AdminField
            label="SEO title"
            name="seo_title"
            defaultValue={stringValue(seo.title)}
          />
          <AdminField
            label="SEO description"
            name="seo_description"
            defaultValue={stringValue(seo.description)}
          />
        </div>
        <AdminSubmit />
      </form>
    </section>
  );
}

function objectValue(value: Json | undefined) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return {};
}

function stringValue(value: Json | undefined) {
  return typeof value === "string" ? value : "";
}
