import Link from "next/link";
import { Menu, MessageCircle, Search } from "lucide-react";
import { categories } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/dealers", label: "Dealers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-px mx-auto flex max-w-7xl items-center justify-between gap-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-brand-red text-sm font-black text-white">
            PF
          </span>
          <span>
            <span className="block text-base font-black uppercase tracking-wide text-ink">
              Profitness
            </span>
            <span className="block text-xs font-semibold text-muted">
              Performance Nutrition
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold uppercase text-ink lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-red">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            aria-label="Tìm kiếm sản phẩm"
            className="hidden h-10 w-10 items-center justify-center rounded border border-line text-ink hover:border-brand-red hover:text-brand-red sm:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center gap-2 rounded bg-brand-red px-4 text-sm font-bold text-white hover:bg-red-700"
          >
            <MessageCircle className="h-4 w-4" />
            Tư vấn
          </Link>
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
                  Categories
                </p>
                <div className="mt-2 grid gap-1 text-sm font-semibold text-muted">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      className="rounded px-3 py-2 hover:bg-surface hover:text-brand-red"
                    >
                      {category.name}
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
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
