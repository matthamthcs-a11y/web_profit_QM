import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircle, Search } from "lucide-react";
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
      <div className="container-px mx-auto flex max-w-7xl items-center justify-between gap-5 py-4">
        <Link href="/" className="relative h-12 w-56 shrink-0">
          <Image
            src="/logo-pro-fitness.svg"
            alt="Pro-Fitness Sports Nutrition"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-bold uppercase text-ink lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-red">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            aria-label={c.common.search}
            className="hidden h-10 w-10 items-center justify-center rounded border border-line text-ink hover:border-brand-red hover:text-brand-red sm:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
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
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded px-3 py-2 hover:bg-surface hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 border-t border-line pt-3">
                <p className="px-3 text-xs font-black uppercase text-muted">
                  {c.common.category}
                </p>
                <div className="mt-2 grid gap-1 text-sm font-semibold text-muted">
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
          </details>
        </div>
      </div>

      <div className="hidden border-t border-line bg-surface lg:block">
        <div className="container-px mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto py-3 text-sm font-semibold text-muted">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="whitespace-nowrap hover:text-brand-red"
            >
              {text(category.name, locale)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
