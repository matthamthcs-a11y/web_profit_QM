"use client";

import { useMemo, useState } from "react";
import { AdminAssetField } from "@/components/admin-asset-field";
import type { Json } from "@/lib/supabase/database.types";
import { buildVariantKey } from "@/lib/product-variants";
import type { Locale, LocalizedText } from "@/lib/types";

type AdminProductVariantsFieldProps = {
  sizes: Array<{ label: string; label_i18n: Json | null }>;
  flavors: Array<{ name: Json }>;
  variants: Array<{
    combination_key: string;
    price: number | null;
    image_path: string | null;
    nutrition_image_path: string | null;
    is_default: boolean;
    is_published: boolean;
  }>;
  locale: Locale;
  copy: {
    inputsTitle: string;
    listTitle: string;
    flavorsLabel: string;
    sizesLabel: string;
    createButton: string;
    empty: string;
    fallback: string;
    price: string;
    image: string;
    nutritionImage: string;
    defaultVariant: string;
    published: string;
  };
};

type VariantDraft = {
  key: string;
  flavor: LocalizedText;
  size: LocalizedText;
  price?: number | null;
  imagePath?: string | null;
  nutritionImagePath?: string | null;
  isDefault: boolean;
  isPublished: boolean;
};

export function AdminProductVariantsField({
  sizes,
  flavors,
  variants,
  locale,
  copy,
}: AdminProductVariantsFieldProps) {
  const initialFlavorVi = flavors.map((row) => localized(row.name, "vi")).join("\n");
  const initialFlavorEn = flavors.map((row) => localized(row.name, "en")).join("\n");
  const initialSizeVi = sizes.map((row) => localized(row.label_i18n, "vi", row.label)).join("\n");
  const initialSizeEn = sizes.map((row) => localized(row.label_i18n, "en", row.label)).join("\n");
  const variantsByKey = useMemo(
    () => new Map(variants.map((variant) => [variant.combination_key, variant])),
    [variants],
  );
  const [flavorsVi, setFlavorsVi] = useState(initialFlavorVi);
  const [flavorsEn, setFlavorsEn] = useState(initialFlavorEn);
  const [sizesVi, setSizesVi] = useState(initialSizeVi);
  const [sizesEn, setSizesEn] = useState(initialSizeEn);
  const [drafts, setDrafts] = useState(() =>
    buildDrafts(initialFlavorVi, initialFlavorEn, initialSizeVi, initialSizeEn, variantsByKey),
  );

  function generateDrafts() {
    setDrafts(buildDrafts(flavorsVi, flavorsEn, sizesVi, sizesEn, variantsByKey));
  }

  return (
    <div className="grid gap-5">
      <div className="rounded border border-line bg-surface p-4">
        <h4 className="font-black text-ink">{copy.inputsTitle}</h4>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span>{copy.flavorsLabel} VI</span>
            <textarea
              name="flavors_vi"
              value={flavorsVi}
              onChange={(event) => setFlavorsVi(event.target.value)}
              rows={4}
              className="rounded border border-line px-3 py-2 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span>{copy.flavorsLabel} EN</span>
            <textarea
              name="flavors_en"
              value={flavorsEn}
              onChange={(event) => setFlavorsEn(event.target.value)}
              rows={4}
              className="rounded border border-line px-3 py-2 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span>{copy.sizesLabel} VI</span>
            <textarea
              name="sizes_vi"
              value={sizesVi}
              onChange={(event) => setSizesVi(event.target.value)}
              rows={4}
              className="rounded border border-line px-3 py-2 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span>{copy.sizesLabel} EN</span>
            <textarea
              name="sizes_en"
              value={sizesEn}
              onChange={(event) => setSizesEn(event.target.value)}
              rows={4}
              className="rounded border border-line px-3 py-2 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={generateDrafts}
          className="mt-4 h-10 rounded bg-ink px-4 text-sm font-black uppercase text-white hover:bg-slate-700"
        >
          {copy.createButton}
        </button>
      </div>

      <div className="grid gap-3">
        <div>
          <h4 className="font-black text-ink">{copy.listTitle}</h4>
          <p className="mt-1 rounded border border-line bg-surface p-3 text-xs font-semibold text-muted">
            {copy.fallback}
          </p>
        </div>

        {drafts.length ? (
          drafts.map((draft) => (
            <div
              key={draft.key}
              className="grid gap-4 rounded border border-line p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h5 className="font-black text-ink">
                    {localizedText(draft.flavor, locale)} / {localizedText(draft.size, locale)}
                  </h5>
                  <p className="mt-1 text-xs font-semibold text-muted">
                    {draft.key}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 text-sm font-black text-ink">
                    <input
                      type="radio"
                      name="default_variant_key"
                      value={draft.key}
                      defaultChecked={draft.isDefault}
                      className="h-4 w-4 accent-brand-red"
                    />
                    {copy.defaultVariant}
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-black text-ink">
                    <input
                      type="checkbox"
                      name={`variant_is_published:${draft.key}`}
                      defaultChecked={draft.isPublished}
                      className="h-4 w-4 accent-brand-red"
                    />
                    {copy.published}
                  </label>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[0.42fr_1fr_1fr]">
                <label className="grid gap-1.5 text-sm font-bold text-ink">
                  <span>{copy.price}</span>
                  <input
                    name={`variant_price:${draft.key}`}
                    type="number"
                    min={0}
                    defaultValue={draft.price ?? ""}
                    className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
                <AdminAssetField
                  label={copy.image}
                  name={`variant_image_path:${draft.key}`}
                  defaultValue={draft.imagePath}
                  folder="products/variants"
                  accept="image/*"
                  locale={locale}
                />
                <AdminAssetField
                  label={copy.nutritionImage}
                  name={`variant_nutrition_image_path:${draft.key}`}
                  defaultValue={draft.nutritionImagePath}
                  folder="products/variant-nutrition"
                  accept="image/*"
                  locale={locale}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded border border-dashed border-line bg-white p-4 text-sm font-semibold text-muted">
            {copy.empty}
          </p>
        )}
      </div>
    </div>
  );
}

function buildDrafts(
  flavorsVi: string,
  flavorsEn: string,
  sizesVi: string,
  sizesEn: string,
  variantsByKey: Map<string, AdminProductVariantsFieldProps["variants"][number]>,
): VariantDraft[] {
  const flavors = parseLocalizedLinesByVi(flavorsVi, flavorsEn);
  const sizes = parseLocalizedLinesByVi(sizesVi, sizesEn);

  return flavors.flatMap((flavor, flavorIndex) =>
    sizes.map((size, sizeIndex) => {
      const key = buildVariantKey(flavor, size);
      const existing = variantsByKey.get(key);
      const sortOrder = flavorIndex * sizes.length + sizeIndex + 1;

      return {
        key,
        flavor,
        size,
        price: existing?.price,
        imagePath: existing?.image_path,
        nutritionImagePath: existing?.nutrition_image_path,
        isDefault: existing?.is_default ?? sortOrder === 1,
        isPublished: existing?.is_published ?? true,
      };
    }),
  );
}

function parseLocalizedLinesByVi(viText: string, enText: string): LocalizedText[] {
  const viLines = parseLines(viText);
  const enLines = parseLines(enText);

  return viLines.map((vi, index) => {
    const en = enLines[index] ?? vi;

    return { vi, en };
  });
}

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function localized(value: Json | null, locale: Locale, fallbackText = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const localeValue = value[locale];
    const fallback = value.vi ?? value.en;

    if (typeof localeValue === "string") {
      return localeValue;
    }

    if (typeof fallback === "string") {
      return fallback;
    }
  }

  return fallbackText;
}

function localizedText(value: LocalizedText, locale: Locale) {
  return value[locale] || value.vi || value.en;
}
