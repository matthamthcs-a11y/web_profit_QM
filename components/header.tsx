import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, MessageCircle } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { categories } from "@/lib/mock-data";
import { copy, getLocale, HOTLINE, text } from "@/lib/i18n";

export async function Header() {
  const locale = await getLocale();
  const c = copy[locale];
  const navItems = [
    { href: "/", label: c.nav.home },
    { href: "/products", label: c.nav.products },
    { href: "/about", label: c.nav.about },
    { href: "/certificates", label: c.nav.certificates },
    { href: "/dealers", label: c.nav.dealers },
    { href: "/contact", label: c.nav.contact },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-px mx-auto grid max-w-7xl grid-cols-[minmax(220px,320px)_1fr_auto] items-center gap-3 py-3 lg:gap-5 lg:py-4">
        <Link
          href="/"
          className="relative h-12 w-full shrink-0 justify-self-start md:h-14 lg:h-16"
        >
          <Image
            src="/logo.webp"
            alt="Pro-Fitness Sports Nutrition"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-4 whitespace-nowrap text-[13px] font-extrabold uppercase tracking-tight text-ink xl:flex">
          {navItems.slice(0, 1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-1 py-1 leading-none hover:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 rounded px-1 py-1 leading-none hover:text-brand-red"
            >
              {c.nav.products}
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-20 mt-3 w-72 rounded border border-line bg-white p-3 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="grid gap-1 text-sm font-semibold text-ink">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    className="rounded px-3 py-2 hover:bg-surface hover:text-brand-red"
                  >
                    {text(category.name, locale)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {navItems.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-1 py-1 leading-none hover:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle locale={locale} />
          <a
            href={`tel:${HOTLINE}`}
            className="hidden h-10 items-center gap-2 rounded bg-brand-red px-4 text-sm font-bold text-white hover:bg-red-700 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            {HOTLINE}
          </a>
          <details className="relative lg:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded border border-line text-ink">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 top-12 w-72 rounded border border-line bg-white p-3 shadow-soft">
              <nav className="grid gap-1 text-sm font-bold uppercase text-ink">
                {navItems.slice(0, 1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded px-3 py-2 hover:bg-surface hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                ))}
                <details className="rounded border border-line px-3 py-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span>{c.nav.products}</span>
                    <ChevronDown className="h-4 w-4" />
                  </summary>
                  <div className="mt-2 grid gap-1 border-t border-line pt-2 text-sm font-semibold text-muted">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        className="rounded px-2 py-2 hover:bg-surface hover:text-brand-red"
                      >
                        {text(category.name, locale)}
                      </Link>
                    ))}
                  </div>
                </details>
                {navItems.slice(2).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded px-3 py-2 hover:bg-surface hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
