import type { Metadata } from "next";
import { DocumentCard, getDocumentFileKind } from "@/components/document-card";
import { SectionHeading } from "@/components/section-heading";
import { getDocuments } from "@/lib/data/documents";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Chứng nhận và tài liệu Pro-Fitness Sports Nutrition.",
};

export default async function CertificatesPage() {
  const locale = await getLocale();
  const documents = await getDocuments();

  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow={locale === "vi" ? "Chứng nhận" : "Certificates"}
        title={locale === "vi" ? "Chứng nhận & tài liệu" : "Certificates & documents"}
        description={
          locale === "vi"
            ? "Khu vực hiển thị giấy chứng nhận phân phối, catalog, COA và công bố ATTP khi khách cung cấp tài liệu."
            : "Area for distribution certificates, catalog, COA and food safety documents once provided."
        }
      />
      <div className="grid gap-5 md:grid-cols-3">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            id={document.id}
            title={document.title}
            description={document.description}
            type={document.type}
            locale={locale}
            hasFile={Boolean(document.filePath)}
            hasThumbnail={Boolean(document.thumbnailPath)}
            fileKind={getDocumentFileKind(document.filePath)}
          />
        ))}
      </div>
    </section>
  );
}
