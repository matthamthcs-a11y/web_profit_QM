import { DocumentCardClient } from "@/components/document-card-client";
import { text } from "@/lib/i18n";
import type { DocumentAsset, LocalizedText, Locale } from "@/lib/types";

type DocumentCardProps = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  type: DocumentAsset["type"];
  locale: Locale;
  hasFile: boolean;
  hasThumbnail: boolean;
  fileKind: DocumentFileKind;
  compact?: boolean;
};

type DocumentFileKind = "image" | "pdf" | "other";

const typeLabel: Record<DocumentAsset["type"], string> = {
  catalog: "Catalog",
  certificate: "Certificate",
  coa: "COA",
  attp: "ATTP",
};

export function DocumentCard({
  id,
  title,
  description,
  type,
  locale,
  hasFile,
  hasThumbnail,
  fileKind,
  compact = false,
}: DocumentCardProps) {
  return (
    <DocumentCardClient
      id={id}
      title={text(title, locale)}
      description={text(description, locale)}
      typeLabel={typeLabel[type]}
      locale={locale}
      compact={compact}
      hasFile={hasFile}
      hasThumbnail={hasThumbnail}
      fileKind={fileKind}
    />
  );
}

export function getDocumentFileKind(
  filePath?: string | null,
): DocumentFileKind {
  if (!filePath) {
    return "other";
  }

  const cleanPath = filePath.split("?")[0].toLowerCase();

  if (/\.(png|jpe?g|webp|gif|avif|svg)$/.test(cleanPath)) {
    return "image";
  }

  if (cleanPath.endsWith(".pdf")) {
    return "pdf";
  }

  return "other";
}
