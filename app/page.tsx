import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  FlaskConical,
  MessagesSquare,
  PackageCheck,
  ClipboardCheck,
  ShieldCheck,
  Star,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import { DocumentCard, getDocumentFileKind } from "@/components/document-card";
import { HeroBanner } from "@/components/hero-banner";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories } from "@/lib/data/categories";
import { getDocuments } from "@/lib/data/documents";
import { getHomeBanners } from "@/lib/data/home-banners";
import { getBestSellerProductCards } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getTestimonials } from "@/lib/data/testimonials";
import { copy, getLocale, text } from "@/lib/i18n";

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

const founderStory = {
  vi: {
    founder: "Brian Frank, Founder & CEO",
    title: "Sự khác biệt của Hammer",
    description:
      "Chúng tôi là những con người thật, tạo ra các sản phẩm thật, tự nhiên và lành mạnh với rất nhiều thông tin hữu ích, cùng một mục tiêu rõ ràng: giúp bạn đạt trạng thái tốt nhất.",
    link: "Câu chuyện thương hiệu",
    sections: [
      {
        key: "products",
        icon: PackageCheck,
        title: "Sản phẩm",
        text: "Hơn 39 năm phát triển các sản phẩm tự nhiên, hiệu quả, không thêm đường, màu nhân tạo, hương liệu, hóa chất hay chất bảo quản. Công thức ưu tiên chất lượng, thành phần rõ ràng và sản xuất tại Hoa Kỳ.",
        links: [],
      },
      {
        key: "knowledge",
        icon: FlaskConical,
        title: "Kiến thức",
        text: "Hammer hiểu rõ cách nạp năng lượng đúng cho vận động sức bền. Các hướng dẫn thực tế, dựa trên trải nghiệm thi đấu và tập luyện, giúp hạn chế chuột rút, mệt mỏi, khó chịu tiêu hóa và các vấn đề do nạp sai cách.",
        links: [{ label: "Xem danh mục sản phẩm", href: "/products" }],
      },
      {
        key: "service",
        icon: MessagesSquare,
        title: "Dịch vụ",
        text: "Tư vấn tận tâm, phản hồi nhanh và luôn xem nhu cầu của khách hàng là trọng tâm. Pro-Fitness hỗ trợ khách chọn đúng sản phẩm, đúng hương vị và đúng cách dùng.",
        links: [{ label: "Liên hệ tư vấn", href: "/contact" }],
      },
    ],
    closing: "Đồng hành cùng sức bền và sức khỏe tối ưu từ năm 1987",
  },
  en: {
    founder: "Brian Frank, Founder & CEO",
    title: "The Hammer Difference",
    description:
      "We're real people making real, natural, healthy products with helpful information and one clear goal: helping you be your best.",
    link: "Our company",
    sections: [
      {
        key: "products",
        icon: PackageCheck,
        title: "Products",
        text: "39 years of developing effective, natural products free of added sugars, artificial colors, flavors, chemicals and preservatives. We use clean carbohydrates, high quality proteins and ingredients in our 100% USA-made products.",
        links: [],
      },
      {
        key: "knowledge",
        icon: FlaskConical,
        title: "Knowledge",
        text: "No one knows more about properly fueling for endurance exercise than Hammer. We share proven fueling techniques to help eliminate cramping, GI distress, fatigue and other symptoms caused by poor fueling practices.",
        links: [{ label: "Visit the product catalog", href: "/products" }],
      },
      {
        key: "service",
        icon: MessagesSquare,
        title: "Service",
        text: "Second to none, the best you've ever had. We treat every customer like they are important to us, because they are.",
        links: [{ label: "Contact us", href: "/contact" }],
      },
    ],
    closing: "Promoting endurance & optimum health since 1987",
  },
} as const;

export default async function HomePage() {
  const locale = await getLocale();
  const c = copy[locale];
  const isVi = locale === "vi";
  const [categories, documents, bestSellers, testimonials, siteSettings, banners] =
    await Promise.all([
      getCategories(),
      getDocuments(),
      getBestSellerProductCards(),
      getTestimonials(),
      getSiteSettings(),
      getHomeBanners(),
    ]);
  const founderCategoryLinks = categories.slice(0, 3).map((category) => ({
    label: text(category.name, locale),
    href: `/products?category=${category.slug}`,
  }));

  return (
    <>
      <HeroBanner locale={locale} products={bestSellers} banners={banners} />

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
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                description={doc.description}
                type={doc.type}
                locale={locale}
                compact
                hasFile={Boolean(doc.filePath)}
                hasThumbnail={Boolean(doc.thumbnailPath)}
                fileKind={getDocumentFileKind(doc.filePath)}
              />
            ))}
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

      <section className="bg-white py-16">
        <div className="container-px mx-auto max-w-5xl">
          <div className="overflow-hidden rounded border border-line bg-white shadow-soft md:grid md:grid-cols-[0.9fr_1.5fr]">
            <aside className="bg-[#f4eee9]">
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <Image
                  src="/founder-brian-frank.jpg"
                  alt="Brian Frank, Founder and CEO"
                  fill
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-7 md:p-8">
                <p className="text-xs font-semibold text-muted">
                  {founderStory[locale].founder}
                </p>
                <h2 className="mt-7 max-w-xs text-3xl font-black uppercase leading-none tracking-normal text-ink">
                  {founderStory[locale].title}
                </h2>
                <p className="mt-7 max-w-sm text-sm leading-6 text-ink">
                  {founderStory[locale].description}
                </p>
                <Link
                  href="/about"
                  className="mt-5 inline-flex text-sm font-black text-brand-red hover:text-red-700"
                >
                  {founderStory[locale].link}
                </Link>
              </div>
            </aside>

            <div className="grid gap-8 p-7 md:p-10">
              {founderStory[locale].sections.map((item) => {
                const Icon = item.icon;
                const itemLinks =
                  item.key === "products" ? founderCategoryLinks : item.links;

                return (
                  <article
                    key={item.title}
                    className="grid gap-5 sm:grid-cols-[3rem_1fr]"
                  >
                    <Icon className="h-9 w-9 text-slate-500" />
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-normal text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-sm leading-6 text-ink">
                        {item.text}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm font-black text-brand-red">
                        {itemLinks.map((link, index) => (
                          <span
                            key={`${item.key}-${link.href}`}
                            className="inline-flex items-center"
                          >
                            {index > 0 ? (
                              <span className="mr-3 text-slate-300">|</span>
                            ) : null}
                            <Link href={link.href} className="hover:text-red-700">
                              {link.label}
                            </Link>
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
              <p className="pl-0 text-2xl font-black uppercase leading-none tracking-normal text-ink sm:pl-[4.25rem]">
                {founderStory[locale].closing}
              </p>
            </div>
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
              href={`tel:${siteSettings.hotline}`}
              className="inline-flex h-12 items-center gap-2 rounded border border-white/30 bg-slate-950/20 px-5 text-sm font-black text-white hover:bg-slate-950/30"
            >
              {isVi
                ? `Gọi hotline ${siteSettings.hotline}`
                : `Call hotline ${siteSettings.hotline}`}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
