import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getDocuments } from "@/lib/data/documents";
import { getLocale, text } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Chung nhan va tai lieu Pro-Fitness Sports Nutrition.",
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
          <article key={document.id} className="rounded border border-line p-6">
            <FileCheck2 className="mb-5 h-8 w-8 text-brand-red" />
            <p className="text-xs font-black uppercase text-brand-red">
              {document.type}
            </p>
            <h2 className="mt-3 text-2xl font-black text-ink">
              {text(document.title, locale)}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {text(document.description, locale)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
