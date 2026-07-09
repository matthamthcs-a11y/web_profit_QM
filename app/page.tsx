import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Award,
  FileText,
  Star,
  ShieldCheck,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import { HeroBanner } from "@/components/hero-banner";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories, documents, products, testimonials } from "@/lib/mock-data";
import { HOTLINE, copy, getLocale, text } from "@/lib/i18n";

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
  const isVi = locale === "vi";
  const documentMeta = {
    catalog: {
      icon: FileText,
      tone: "text-brand-red",
    },
    certificate: {
      icon: Award,
      tone: "text-brand-gold",
    },
    coa: {
      icon: ShieldCheck,
      tone: "text-emerald-600",
    },
    attp: {
      icon: ClipboardCheck,
      tone: "text-sky-600",
    },
  } as const;

  return (
    <>
      <HeroBanner locale={locale} products={bestSellers} />

      <section className="container-px mx-auto max-w-7xl py-14">
        <SectionHeading
          eyebrow={isVi ? "Danh mục" : "Categories"}
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

      <section className="bg-surface py-14">
        <div className="container-px mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={isVi ? "Sản phẩm bán chạy" : "Best sellers"}
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

      <section className="container-px mx-auto max-w-7xl py-14">
        <SectionHeading
          eyebrow={isVi ? "Tin cậy" : "Trust"}
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

      <section className="bg-white py-14">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={isVi ? "Tài liệu" : "Documents"}
            title={isVi ? "Chứng nhận & tài liệu" : "Certificates & documents"}
            description={
              isVi
                ? "Các tài liệu quan trọng để khách hàng tham khảo nhanh về catalog, chứng nhận và hồ sơ an toàn."
                : "Important materials for quickly reviewing the catalog, certificates and safety documents."
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {documents.map((doc) => {
              const meta = documentMeta[doc.type];
              const Icon = meta.icon;

              return (
                <article
                  key={doc.id}
                  className="rounded border border-line bg-surface p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon className={`h-8 w-8 ${meta.tone}`} />
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-ink">
                      {doc.type}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-ink">
                    {text(doc.title, locale)}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {text(doc.description, locale)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={isVi ? "Phản hồi" : "Reviews"}
            title={c.home.reviewsTitle}
            description={c.home.reviewsDescription}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="rounded border border-line bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-1 text-brand-red">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star
                      key={`${item.id}-star-${index}`}
                      className="h-5 w-5 fill-current"
                    />
                  ))}
                </div>
                <p className="mt-4 text-base leading-7 text-ink">
                  &ldquo;{text(item.quote, locale)}&rdquo;
                </p>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="font-black text-ink">{item.name}</p>
                  <p className="text-sm text-muted">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-red py-12 text-white">
        <div className="container-px mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/75">
              {isVi ? "Liên hệ nhanh" : "Fast contact"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-normal md:text-4xl">
              {isVi
                ? "Cần tư vấn sản phẩm ngay bây giờ?"
                : "Need product advice now?"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/80">
              {isVi
                ? "Gọi hotline hoặc xem toàn bộ sản phẩm để tìm đúng vị, đúng công dụng và liên hệ nhanh với sales."
                : "Call the hotline or browse all products to find the right flavor, benefit and sales contact quickly."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-12 items-center gap-2 rounded bg-white px-5 text-sm font-black text-brand-red hover:bg-white/90"
            >
              {isVi ? "Xem sản phẩm" : "View products"}
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded border border-white/30 bg-white/10 px-5 text-sm font-black text-white hover:bg-white/15"
            >
              {isVi ? "Liên hệ" : "Contact"}
            </Link>
            <a
              href={`tel:${HOTLINE}`}
              className="inline-flex h-12 items-center gap-2 rounded border border-white/30 bg-slate-950/20 px-5 text-sm font-black text-white hover:bg-slate-950/30"
            >
              {isVi ? `Gọi hotline ${HOTLINE}` : `Call hotline ${HOTLINE}`}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
