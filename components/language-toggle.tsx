"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

type LanguageToggleProps = {
  locale: Locale;
};

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const router = useRouter();

  function changeLanguage(nextLocale: Locale) {
    document.cookie = `profitness_locale=${nextLocale}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="inline-flex h-10 items-stretch overflow-hidden rounded border border-line bg-white text-xs font-black">
      <button
        type="button"
        onClick={() => changeLanguage("vi")}
        className={`min-w-12 px-3 ${
          locale === "vi"
            ? "bg-brand-red text-white"
            : "bg-white text-ink hover:text-brand-red"
        }`}
        aria-pressed={locale === "vi"}
        aria-label="Switch to Vietnamese"
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`min-w-12 border-l border-line px-3 ${
          locale === "en"
            ? "bg-brand-red text-white"
            : "bg-white text-ink hover:text-brand-red"
        }`}
        aria-pressed={locale === "en"}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
