import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories, products } from "@/lib/mock-data";
import { copy, getLocale, HOTLINE, text } from "@/lib/i18n";

const trustItems = {
  vi: [
    {
      icon: ShieldCheck,
      title: "Hàng chính hãng",
      text: "Thông tin sản phẩm, thương hiệu và xuất xứ được trình bày rõ ràng.",
    },
    {
      icon: ClipboardCheck,
      title: "Giá và hương vị rõ ràng",
      text: "Khách hàng xem nhanh giá bán, quy cách và các vị đang có.",
    },
    {
      icon: UserRoundCheck,
      title: "Tư vấn nhanh",
      text: "Nút gọi hotline và Zalo giúp khách liên hệ sales ngay khi cần.",
    },
    {
      icon: Truck,
      title: "Hỗ trợ đại lý",
      text: "Trang đại lý giúp khách hàng tìm điểm tư vấn và phân phối phù hợp.",
    },
  ],
  en: [
    {
      icon: ShieldCheck,
      title: "Official products",
      text: "Product, brand and origin information is presented clearly.",
    },
    {
      icon: ClipboardCheck,
      title: "Clear prices and flavors",
      text: "Customers can quickly review prices, sizes and available flavors.",
    },
    {
      icon: UserRoundCheck,
      title: "Fast consultation",
      text: "Hotline and Zalo buttons help customers contact sales immediately.",
    },
    {
      icon: Truck,
      title: "Dealer support",
      text: "The dealer page helps customers find suitable consultation points.",
    },
  ],
} as const;

export default async function HomePage() {
  const locale = await getLocale();
  const c = copy[locale];
  const bestSellers = products.filter((product) => product.isBestSeller);

  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-px mx-auto grid min-h-[calc(100vh-136px)] max-w-7xl items-center gap-12 py-12 lg:grid-cols-[0.95fr_1fr]">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-red-300">
              {c.home.eyebrow}
            </p>
            <div className="relative mb-7 h-24 w-full max-w-xl bg-white p-3">
              <Image
                src="/logo-pro-fitness.svg"
                alt="Pro-Fitness Sports Nutrition"
                fill
                priority
                className="object-contain"
              />
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
              {c.home.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {c.home.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded bg-brand-red px-5 text-sm font-black text-white hover:bg-red-700"
              >
                {c.common.viewProducts}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${HOTLINE}`}
                className="inline-flex h-12 items-center gap-2 rounded border border-white/20 px-5 text-sm font-black text-white hover:border-white"
              >
                <Phone className="h-4 w-4" />
                {HOTLINE}
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded border border-white/10 bg-white p-6 text-ink shadow-soft">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-black uppercase text-brand-red">
                  {c.home.bestSellersTitle}
                </span>
                <MessageCircle className="h-5 w-5 text-brand-red" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {bestSellers.slice(0, 4).map((product) => (
                  <Link
                    href={`/products/${product.slug}`}
                    key={product.id}
                    className="rounded border border-line bg-surface p-4 hover:border-brand-red"
                  >
                    <p className="text-xs font-bold uppercase text-brand-red">
                      {text(product.categoryName, locale)}
                    </p>
                    <p className="mt-2 font-black">{text(product.name, locale)}</p>
                    <p className="mt-2 text-xs font-semibold text-muted">
                      {text(product.primaryGoal, locale)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Metric value="6" label={c.common.category} />
              <Metric value="4" label={c.common.bestSeller} />
              <Metric value="1" label="Hotline" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-16">
        <SectionHeading
          eyebrow="Categories"
          title={c.home.categoriesTitle}
          description={c.home.categoriesDescription}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              href={`/products?category=${category.slug}`}
              key={category.id}
              className="rounded border border-line bg-white p-6 shadow-sm hover:border-brand-red hover:shadow-soft"
            >
              <h3 className="text-xl font-black text-ink">
                {text(category.name, locale)}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {text(category.description, locale)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-px mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Best sellers"
              title={c.home.bestSellersTitle}
              description={c.home.bestSellersDescription}
            />
            <Link
              href="/products"
              className="mb-8 inline-flex h-11 items-center gap-2 rounded border border-line bg-white px-4 text-sm font-black text-ink hover:border-brand-red hover:text-brand-red"
            >
              {c.common.viewProducts}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-16">
        <SectionHeading
          eyebrow="Trust"
          title={c.home.trustTitle}
          description={c.home.trustDescription}
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {trustItems[locale].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded border border-line p-6">
                <Icon className="mb-5 h-7 w-7 text-brand-red" />
                <h3 className="font-black text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded bg-white/10 p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-slate-300">{label}</p>
    </div>
  );
}
