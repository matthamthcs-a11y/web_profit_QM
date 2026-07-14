import { Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data/site-settings";
import { copy } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type QuickContactProps = {
  locale: Locale;
};

export async function QuickContact({ locale }: QuickContactProps) {
  const c = copy[locale];
  const siteSettings = await getSiteSettings();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-3 shadow-soft md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={siteSettings.zaloUrl}
          className="flex h-11 items-center justify-center rounded bg-brand-red text-sm font-black text-white"
        >
          {c.common.messageZalo}
        </a>
        <a
          href={`tel:${siteSettings.hotline}`}
          className="flex h-11 items-center justify-center gap-2 rounded bg-ink text-sm font-black text-white"
        >
          <Phone className="h-4 w-4" />
          {siteSettings.hotline}
        </a>
      </div>
    </div>
  );
}
