"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

type LanguageToggleProps = {
  locale: Locale;
};

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const router = useRouter();

  function changeLanguage(nextLocale: Locale) {
    if (nextLocale === locale) return;
    document.cookie = `profitness_locale=${nextLocale}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div
      className="inline-flex h-10 items-stretch overflow-hidden rounded border border-line bg-white text-xs font-black"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => changeLanguage("vi")}
        className={`inline-flex min-w-12 items-center justify-center px-3 transition ${
          locale === "vi"
            ? "bg-brand-red text-white"
            : "bg-white text-ink hover:text-brand-red"
        }`}
        aria-pressed={locale === "vi"}
        aria-label="Switch to Vietnamese"
        title="Tiếng Việt"
      >
        <VietnamFlag />
        <span className="sr-only">Tiếng Việt</span>
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`inline-flex min-w-12 items-center justify-center border-l border-line px-3 transition ${
          locale === "en"
            ? "bg-brand-red text-white"
            : "bg-white text-ink hover:text-brand-red"
        }`}
        aria-pressed={locale === "en"}
        aria-label="Switch to American English"
        title="American English"
      >
        <UnitedStatesFlag />
        <span className="sr-only">American English</span>
      </button>
    </div>
  );
}

function VietnamFlag() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className="h-4 w-6 rounded-[2px] shadow-sm"
    >
      <rect width="24" height="16" fill="#da251d" />
      <path
        fill="#ffde00"
        d="m12 3 1.18 3.63H17l-3.09 2.24 1.18 3.63L12 10.26 8.91 12.5l1.18-3.63L7 6.63h3.82L12 3Z"
      />
    </svg>
  );
}

function UnitedStatesFlag() {
  const stripes = Array.from({ length: 13 }, (_, index) => (
    <rect
      key={index}
      y={(16 / 13) * index}
      width="24"
      height={16 / 13}
      fill={index % 2 === 0 ? "#b22234" : "#fff"}
    />
  ));

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className="h-4 w-6 rounded-[2px] shadow-sm"
    >
      {stripes}
      <rect width="10.5" height="8.6" fill="#3c3b6e" />
      {Array.from({ length: 15 }, (_, index) => {
        const x = 1.4 + (index % 5) * 1.8;
        const y = 1.2 + Math.floor(index / 5) * 2.2;

        return <circle key={index} cx={x} cy={y} r="0.35" fill="#fff" />;
      })}
    </svg>
  );
}
