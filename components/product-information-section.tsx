"use client";

import { Maximize2, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/types";

type ProductInformationSectionProps = {
  locale: Locale;
  nutritionImagePath: string | null;
  blocks: Array<{
    title: string;
    items: string[];
  }>;
};

const copy = {
  vi: {
    eyebrow: "Thông tin sản phẩm",
    title: "Bảng thành phần & hướng dẫn",
    nutrition: "Bảng thành phần",
    openImage: "Phóng lớn ảnh",
    closeImage: "Đóng ảnh",
    readMore: "Xem thêm",
    readLess: "Thu gọn",
  },
  en: {
    eyebrow: "Product information",
    title: "Nutrition facts & guidance",
    nutrition: "Nutrition Facts",
    openImage: "Expand image",
    closeImage: "Close image",
    readMore: "Read more",
    readLess: "Collapse",
  },
} as const;

export function ProductInformationSection({
  locale,
  nutritionImagePath,
  blocks,
}: ProductInformationSectionProps) {
  const t = copy[locale];
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-red">
          {t.eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-ink">
          {t.title}
        </h2>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded border border-line bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-lg font-black text-ink">{t.nutrition}</h3>
            {nutritionImagePath ? (
              <button
                type="button"
                onClick={() => setIsImageOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-line text-ink hover:border-brand-red hover:text-brand-red"
                aria-label={t.openImage}
                title={t.openImage}
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="max-h-[620px] overflow-auto rounded border border-line bg-surface p-3">
            {nutritionImagePath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={nutritionImagePath}
                alt={t.nutrition}
                className="mx-auto h-auto max-w-full object-contain"
                loading="lazy"
              />
            ) : null}
          </div>
        </div>

        <div className="grid gap-4">
          {blocks.map((block) => (
            <InfoPanel
              key={block.title}
              title={block.title}
              items={block.items}
              readMoreLabel={t.readMore}
              readLessLabel={t.readLess}
            />
          ))}
        </div>
      </div>

      {isImageOpen && nutritionImagePath ? (
        <div
          className="fixed inset-0 z-[120] bg-ink/80 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={t.nutrition}
        >
          <button
            type="button"
            onClick={() => setIsImageOpen(false)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded bg-white text-ink shadow-soft hover:text-brand-red"
            aria-label={t.closeImage}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex h-full items-center justify-center">
            <div className="max-h-full max-w-5xl overflow-auto rounded bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nutritionImagePath}
                alt={t.nutrition}
                className="mx-auto h-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function InfoPanel({
  title,
  items,
  readMoreLabel,
  readLessLabel,
}: {
  title: string;
  items: string[];
  readMoreLabel: string;
  readLessLabel: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanItems = items.map((item) => item.trim()).filter(Boolean);
  const text = cleanItems.join("\n\n");
  const hasLongContent = text.length > 320 || text.split(/\r?\n/).length > 7;

  return (
    <div className="rounded border border-line bg-white p-5 shadow-sm">
      <h3 className="text-xl font-black text-ink">{title}</h3>
      {text ? (
        <>
          <div
            className={`mt-4 whitespace-pre-line pr-2 text-sm leading-7 text-muted ${
              hasLongContent
                ? isExpanded
                  ? "max-h-80 overflow-y-auto"
                  : "max-h-36 overflow-hidden"
                : ""
            }`}
          >
            {text}
          </div>
          {hasLongContent ? (
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className="mt-3 text-sm font-black text-brand-red hover:text-red-700"
            >
              {isExpanded ? readLessLabel : readMoreLabel}
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
