import type { Metadata } from "next";
import { deleteDocument, upsertDocument } from "@/app/admin/actions";
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
import { getAdminDocuments } from "@/lib/admin/data";
import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin Documents",
};

type DocumentCopy = (typeof documentCopy)[Locale];

const documentCopy = {
  vi: {
    eyebrow: "Trust",
    title: "Chứng nhận & tài liệu",
    description: "Quản lý catalog, chứng nhận phân phối, COA và ATTP.",
    addNew: "Thêm tài liệu mới",
    fields: {
      title: "Tiêu đề",
      description: "Mô tả",
      type: "Loại tài liệu",
      file: "File tài liệu",
      thumbnail: "Ảnh đại diện tài liệu",
      sortOrder: "Vị trí hiển thị",
      published: "Đang hiển thị trên website",
    },
  },
  en: {
    eyebrow: "Trust",
    title: "Certificates & documents",
    description: "Manage catalogs, distribution certificates, COA and ATTP documents.",
    addNew: "Add new document",
    fields: {
      title: "Title",
      description: "Description",
      type: "Document type",
      file: "Document file",
      thumbnail: "Document thumbnail",
      sortOrder: "Display position",
      published: "Visible on website",
    },
  },
} as const;

export default async function AdminDocumentsPage() {
  await requireAdmin();
  const [documents, locale] = await Promise.all([getAdminDocuments(), getLocale()]);
  const t = documentCopy[locale];

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
        <DocumentForm position={documents.length + 1} locale={locale} t={t} />
      </details>
      <div className="mt-8 grid gap-4">
        {documents.map((document, index) => (
          <details key={document.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black">
              {localized(document.title, locale)}{" "}
              <span className="text-sm font-semibold uppercase text-muted">
                / {document.type}
              </span>
            </summary>
            <DocumentForm document={document} position={index + 1} locale={locale} t={t} />
            <form action={deleteDocument} className="mt-4">
              <input type="hidden" name="id" value={document.id} />
              <AdminDeleteButton />
            </form>
          </details>
        ))}
      </div>
    </section>
  );
}

function DocumentForm({
  document,
  position,
  locale,
  t,
}: {
  document?: Awaited<ReturnType<typeof getAdminDocuments>>[number];
  position: number;
  locale: Locale;
  t: DocumentCopy;
}) {
  return (
    <form action={upsertDocument} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={document?.id ?? ""} />
      <LocalizedFields base="title" label={t.fields.title} value={document?.title} />
      <LocalizedFields
        base="description"
        label={t.fields.description}
        value={document?.description}
        textarea
      />
      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>{t.fields.type}</span>
          <select
            name="type"
            defaultValue={document?.type ?? "certificate"}
            className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          >
            <option value="catalog">Catalog</option>
            <option value="certificate">Certificate</option>
            <option value="coa">COA</option>
            <option value="attp">ATTP</option>
          </select>
        </label>
        <AdminAssetField
          label={t.fields.file}
          name="file_path"
          defaultValue={document?.file_path}
          folder="documents"
          accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
          maxSizeMb={50}
          locale={locale}
        />
        <AdminAssetField
          label={t.fields.thumbnail}
          name="thumbnail_path"
          defaultValue={document?.thumbnail_path}
          folder="document-thumbnails"
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
      </div>
      <AdminCheckbox
        label={t.fields.published}
        name="is_published"
        defaultChecked={document?.is_published ?? true}
      />
      <AdminSubmit />
    </form>
  );
}