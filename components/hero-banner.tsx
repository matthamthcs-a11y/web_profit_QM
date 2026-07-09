"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale, Product } from "@/lib/types";

type HeroBannerProps = {
  locale: Locale;
  products: Product[];
};

type SlideTheme = {
  background: string;
  accent: string;
  glow: string;
  packageType: Product["visual"]["packageType"];
};

const slideDecor = {
  gel: { width: "42%", height: "72%" },
  tube: { width: "40%", height: "76%" },
  tub: { width: "38%", height: "74%" },
  pouch: { width: "44%", height: "70%" },
} as const;

function SlideArt({ theme }: { theme: SlideTheme }) {
  const decor = slideDecor[theme.packageType];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 18% 20%, ${theme.glow}, transparent 0 19%), radial-gradient(circle at 80% 18%, rgba(255,255,255,0.12), transparent 0 16%), linear-gradient(135deg, #0b1020 0%, #11182c 52%, #161f33 100%)`,
      }}
    >
      <div
        className="absolute -left-14 bottom-[-10%] h-[42%] w-[42%] rounded-full blur-3xl"
        style={{ backgroundColor: theme.glow }}
      />
      <div
        className="absolute right-[-8%] top-[-10%] h-[34%] w-[34%] rounded-full blur-3xl"
        style={{ backgroundColor: theme.accent, opacity: 0.14 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_0_18%),radial-gradient(circle_at_72%_72%,rgba(255,255,255,0.08),transparent_0_20%)]" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="relative h-[74%] w-[min(88%,920px)] rounded-[30px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-[2px]">
          <div
            className="absolute inset-3 rounded-[24px]"
            style={{ backgroundColor: theme.background }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div
              className="relative flex items-center justify-center rounded-[24px] border-2 bg-white/95 shadow-2xl"
              style={{
                width: decor.width,
                height: decor.height,
                borderColor: theme.accent,
              }}
            >
              <div
                className="absolute left-4 top-4 h-14 w-14 rounded-full opacity-15"
                style={{ backgroundColor: theme.accent }}
              />
              <div
                className="absolute bottom-4 right-4 h-20 w-20 rounded-full opacity-12"
                style={{ backgroundColor: theme.accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroBanner({ locale, products }: HeroBannerProps) {
  const slides = useMemo<SlideTheme[]>(() => {
    return products.slice(0, 3).map((product) => ({
      background: product.visual.background,
      accent: product.visual.accent,
      glow: `${product.visual.accent}30`,
      packageType: product.visual.packageType,
    }));
  }, [products]);

  const [index, setIndex] = useState(0);
  const current = slides[index] ?? slides[0];

  const prev = () => {
    if (!slides.length) return;
    setIndex((value) => (value - 1 + slides.length) % slides.length);
  };

  const next = () => {
    if (!slides.length) return;
    setIndex((value) => (value + 1) % slides.length);
  };

  const slogan =
    locale === "vi" ? "Năng lượng đúng lúc" : "Fuel right, perform better";
  const bannerLine =
    locale === "vi"
      ? "Năng lượng · Sức bền · Phục hồi · Từ 1987"
      : "Energy · Endurance · Recovery · Since 1987";
  const productLabel = locale === "vi" ? "Sản phẩm" : "Products";
  const contactLabel = locale === "vi" ? "Liên hệ" : "Contact";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1600px] px-0">
        <div className="relative overflow-hidden bg-slate-950">
          <div className="relative h-[340px] sm:h-[420px] lg:h-[500px]">
            {slides.length > 0 ? <SlideArt theme={current} /> : null}

            <button
              type="button"
              onClick={prev}
              aria-label="Previous banner"
              className="absolute left-4 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next banner"
              className="absolute right-4 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="border-t border-line bg-white px-6 py-5 sm:py-6">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
              <p className="text-sm font-semibold leading-7 text-slate-800 sm:text-base">
                {slogan}
              </p>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-900/80 sm:text-sm">
                {bannerLine}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-1">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center gap-2 rounded bg-brand-red px-6 text-sm font-black text-white hover:bg-red-700"
                >
                  {productLabel}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded border border-brand-red bg-white px-6 text-sm font-black text-brand-red hover:bg-red-50"
                >
                  {contactLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
