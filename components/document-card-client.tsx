"use client";

import { Eye, FileCheck2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";

type DocumentCardClientProps = {
  id: string;
  title: string;
  description: string;
  typeLabel: string;
  locale: Locale;
  compact: boolean;
  hasFile: boolean;
  hasThumbnail: boolean;
  fileKind: "image" | "pdf" | "other";
};

export function DocumentCardClient({
  id,
  title,
  description,
  typeLabel,
  locale,
  compact,
  hasFile,
  hasThumbnail,
  fileKind,
}: DocumentCardClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const thumbnailUrl = `/api/documents/${encodeURIComponent(id)}/thumbnail`;
  const fileUrl = `/api/documents/${encodeURIComponent(id)}/file`;
  const cardClass =
    "group block h-full rounded border border-line bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-red hover:shadow-soft";
  const thumbnailClass = compact ? "aspect-[16/10]" : "aspect-[4/3]";
  const viewLabel = locale === "vi" ? "Xem tài liệu" : "View document";
  const closeLabel = locale === "vi" ? "Đóng tài liệu" : "Close document";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const content = (
    <>
      <div
        className={`mb-5 flex ${thumbnailClass} items-center justify-center overflow-hidden rounded border border-line bg-surface`}
      >
        {hasThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <FileCheck2 className="h-9 w-9 text-brand-red" />
        )}
      </div>

      <p className="text-xs font-black uppercase text-brand-red">
        {typeLabel}
      </p>
      <h2 className="mt-3 text-2xl font-black text-ink">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      ) : null}
      {hasFile ? (
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-red">
          {viewLabel}
          <Eye className="h-4 w-4" />
        </span>
      ) : null}
    </>
  );

  if (!hasFile) {
    return <article className={cardClass}>{content}</article>;
  }

  return (
    <>
      <button
        type="button"
        className={cardClass}
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
      >
        {content}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[140] bg-ink/80 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="mx-auto flex h-full max-w-6xl flex-col rounded bg-white shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
              <div>
                <p className="text-xs font-black uppercase text-brand-red">
                  {typeLabel}
                </p>
                <h2 className="mt-1 text-lg font-black text-ink sm:text-xl">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line text-ink hover:border-brand-red hover:text-brand-red"
                aria-label={closeLabel}
                title={closeLabel}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="min-h-0 flex-1 overflow-auto bg-surface p-3 sm:p-5"
            >
              {fileKind === "image" ? (
                <div className="flex min-h-full items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl}
                    alt={title}
                    className="h-auto max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <iframe
                  src={fileUrl}
                  title={title}
                  className="h-[78vh] w-full rounded border border-line bg-white"
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
