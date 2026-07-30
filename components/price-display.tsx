import type { Locale } from "@/lib/types";

type PriceDisplayProps = {
  price: number;
  listPrice?: number | null;
  locale: Locale;
  size?: "card" | "detail";
};

const labels = {
  vi: {
    retailPrice: "Giá niêm yết:",
  },
  en: {
    retailPrice: "Retail Price:",
  },
} satisfies Record<Locale, { retailPrice: string }>;

export function PriceDisplay({
  price,
  listPrice,
  locale,
  size = "card",
}: PriceDisplayProps) {
  const hasRetailPrice =
    typeof listPrice === "number" && Number.isFinite(listPrice) && listPrice > price;
  const saleClass =
    size === "detail"
      ? "text-4xl font-black text-brand-red"
      : "text-2xl font-black text-brand-red";

  return (
    <div className={size === "detail" ? "grid gap-1" : "grid gap-0.5"}>
      {hasRetailPrice ? (
        <p className="text-sm font-semibold leading-5 text-slate-500">
          {labels[locale].retailPrice}{" "}
          <span className="line-through">{formatPrice(listPrice)}</span>
        </p>
      ) : null}
      <p className={saleClass}>{formatPrice(price)}</p>
    </div>
  );
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}
