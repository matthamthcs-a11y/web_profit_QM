import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description: "Gioi thieu Pro-Fitness Sports Nutrition.",
};

export default async function AboutPage() {
  const [locale, siteSettings] = await Promise.all([getLocale(), getSiteSettings()]);
  const content = siteSettings.aboutPage;

  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow={content.eyebrow[locale]}
        title={content.title[locale]}
        description={content.description[locale]}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded border border-line p-8">
          <h2 className="text-2xl font-black text-ink">
            {content.block1Title[locale]}
          </h2>
          {content.block1Content[locale].split("\n").map((paragraph, index) => (
            <p key={index} className="mt-4 leading-8 text-muted">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="rounded bg-surface p-8">
          <h2 className="text-2xl font-black text-ink">
            {content.block2Title[locale]}
          </h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
            {content.block2List[locale]
              .split("\n")
              .filter((item) => item.trim() !== "")
              .map((item, index) => (
                <li key={index}>- {item.trim()}</li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
