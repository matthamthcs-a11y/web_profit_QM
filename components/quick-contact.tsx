import { Phone } from "lucide-react";
import { HOTLINE, ZALO_URL, copy } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type QuickContactProps = {
  locale: Locale;
};

export function QuickContact({ locale }: QuickContactProps) {
  const c = copy[locale];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-3 shadow-soft md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={ZALO_URL}
          className="flex h-11 items-center justify-center rounded bg-brand-red text-sm font-black text-white"
        >
          {c.common.messageZalo}
        </a>
        <a
          href={`tel:${HOTLINE}`}
          className="flex h-11 items-center justify-center gap-2 rounded bg-ink text-sm font-black text-white"
        >
          <Phone className="h-4 w-4" />
          {HOTLINE}
        </a>
      </div>
    </div>
  );
}
