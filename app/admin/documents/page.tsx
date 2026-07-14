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

export const metadata: Metadata = {
  title: "Admin Documents",
};

export default async function AdminDocumentsPage() {
  await requireAdmin();
  const documents = await getAdminDocuments();

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Trust"
        title="Chứng nhận & tài liệu"
        description="Quản lý catalog, chứng nhận phân phối, COA và ATTP."
      />
      <details className="mt-6 rounded border border-line p-5" open>
        <summary className="cursor-pointer text-lg font-black">
          Thêm tài liệu mới
        </summary>
        <DocumentForm position={documents.length + 1} />
      </details>
      <div className="mt-8 grid gap-4">
        {documents.map((document, index) => (
          <details key={document.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black">
              {localized(document.title, "vi")}{" "}
              <span className="text-sm font-semibold uppercase text-muted">
                / {document.type}
              </span>
            </summary>
            <DocumentForm document={document} position={index + 1} />
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
}: {
  document?: Awaited<ReturnType<typeof getAdminDocuments>>[number];
  position: number;
}) {
  return (
    <form action={upsertDocument} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={document?.id ?? ""} />
      <LocalizedFields base="title" label="Tiêu đề" value={document?.title} />
      <LocalizedFields
        base="description"
        label="Mô tả"
        value={document?.description}
        textarea
      />
      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          <span>Loại</span>
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
          label="File path"
          name="file_path"
          defaultValue={document?.file_path}
          folder="documents"
          accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
          maxSizeMb={50}
        />
        <AdminAssetField
          label="Thumbnail path"
          name="thumbnail_path"
          defaultValue={document?.thumbnail_path}
          folder="document-thumbnails"
          accept="image/*"
        />
        <AdminField
          label="Vị trí hiển thị"
          name="sort_order"
          type="number"
          defaultValue={position}
          min={1}
        />
      </div>
      <AdminCheckbox
        label="Đang xuất bản"
        name="is_published"
        defaultChecked={document?.is_published ?? true}
      />
      <AdminSubmit />
    </form>
  );
}
