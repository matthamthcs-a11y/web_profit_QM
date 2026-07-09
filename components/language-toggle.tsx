"use client";

import type { Locale } from "@/lib/types";

type LanguageToggleProps = {
  locale: Locale;
};

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const nextLocale = locale === "vi" ? "en" : "vi";

  function changeLanguage() {
    document.cookie = `profitness_locale=${nextLocale}; path=/; max-age=31536000`;
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={changeLanguage}
      className="h-10 rounded border border-line bg-white px-3 text-xs font-black text-ink hover:border-brand-red hover:text-brand-red"
      aria-label="Change language"
    >
      {locale.toUpperCase()} / {nextLocale.toUpperCase()}
    </button>
  );
}
