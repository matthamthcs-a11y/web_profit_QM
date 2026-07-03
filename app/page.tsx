import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenText,
  ClipboardCheck,
  FileCheck2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { SectionHeading } from "@/components/section-heading";
import {
  blogPosts,
  brands,
  categories,
  documents,
  products,
  testimonials,
} from "@/lib/mock-data";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Hàng chính hãng",
    text: "Ưu tiên sản phẩm có nguồn gốc, chứng từ và thương hiệu rõ ràng.",
  },
  {
    icon: ClipboardCheck,
    title: "Công bố đầy đủ",
    text: "Tài liệu ATTP, COA, certificate và catalog được gom theo từng thương hiệu.",
  },
  {
    icon: UserRoundCheck,
    title: "Tư vấn bởi chuyên gia",
    text: "Gợi ý sản phẩm theo môn thể thao, cự ly, thời điểm dùng và mục tiêu tập.",
  },
  {
    icon: Truck,
    title: "Đại lý toàn quốc",
    text: "Kết nối khách hàng với điểm tư vấn và phân phối phù hợp theo khu vực.",
  },
];

const categoryIcons = [Award, FileCheck2, Star, BookOpenText, ShieldCheck, MapPin];

export default function HomePage() {
  const featuredProducts = products.filter((product) => product.isFeatured);
  const heroProduct = featuredProducts[0];

  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-px mx-auto grid min-h-[calc(100vh-136px)] max-w-7xl items-center gap-12 py-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-red-300">
              Energy · Endurance · Recovery
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal md:text-7xl">
              Profitness
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Catalog dinh dưỡng thể thao cho runner, cyclist, triathlete và
              người tập luyện nghiêm túc. Trọng tâm là sản phẩm chính hãng, tài
              liệu minh bạch và tư vấn đúng nhu cầu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded bg-brand-red px-5 text-sm font-black text-white hover:bg-red-700"
              >
                Xem sản phẩm
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded border border-white/20 px-5 text-sm font-black text-white hover:border-white"
              >
                Liên hệ tư vấn
                <MessageCircle className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center">
              <Metric value="6" label="Danh mục" />
              <Metric value="3" label="Thương hiệu" />
              <Metric value="24h" label="Tư vấn" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded border border-white/10 bg-white p-4 text-ink shadow-soft">
              <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
                <ProductVisual product={heroProduct} size="hero" />
                <div className="grid content-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-brand-red">
                      Featured product
                    </p>
                    <h2 className="mt-3 text-3xl font-black leading-tight text-ink">
                      {heroProduct.name}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {heroProduct.shortDescription}
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {featuredProducts.slice(1, 4).map((product) => (
                      <Link
                        href={`/products/${product.slug}`}
                        key={product.id}
                        className="rounded border border-line bg-surface p-4 hover:border-brand-red"
                      >
                        <p className="text-xs font-bold uppercase text-brand-red">
                          {product.categoryName}
                        </p>
                        <p className="mt-2 font-black">{product.name}</p>
                        <p className="mt-1 text-xs font-semibold text-muted">
                          {product.primaryGoal}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-bold text-slate-300">
              <span className="rounded bg-white/10 px-3 py-2">No cart</span>
              <span className="rounded bg-white/10 px-3 py-2">Catalog first</span>
              <span className="rounded bg-white/10 px-3 py-2">Dealer ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-16">
        <SectionHeading
          eyebrow="Categories"
          title="Danh mục nổi bật"
          description="Cấu trúc danh mục theo cách khách hàng tìm sản phẩm: năng lượng, điện giải, phục hồi, protein và supplement nền."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = categoryIcons[index % categoryIcons.length];
            return (
              <Link
                href={`/products?category=${category.slug}`}
                key={category.id}
                className="group rounded border border-line bg-white p-6 shadow-sm hover:border-brand-red hover:shadow-soft"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded bg-red-50 text-brand-red group-hover:bg-brand-red group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-ink">{category.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-px mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Top products"
              title="Sản phẩm nổi bật"
              description="Dữ liệu hiện là mock data để khách hàng duyệt layout trước khi kết nối Supabase."
            />
            <Link
              href="/products"
              className="mb-8 inline-flex h-11 items-center gap-2 rounded border border-line bg-white px-4 text-sm font-black text-ink hover:border-brand-red hover:text-brand-red"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-16">
        <SectionHeading
          eyebrow="Trust"
          title="Tại sao chọn Profitness"
          description="Nhấn mạnh niềm tin, tài liệu và tư vấn thay vì trải nghiệm mua hàng trực tuyến."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
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

      <section className="bg-ink py-16 text-white">
        <div className="container-px mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Brands & documents"
              title="Thương hiệu và tài liệu minh bạch"
              description="Khu vực này về sau sẽ nối Supabase Storage để quản lý catalog, certificate, COA và công bố ATTP."
            />
            <Link
              href="/brands"
              className="inline-flex h-11 items-center gap-2 rounded bg-white px-4 text-sm font-black text-ink hover:bg-slate-100"
            >
              Xem thương hiệu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              {brands.map((brand) => (
                <Link
                  href="/brands"
                  key={brand.id}
                  className="rounded border border-white/10 bg-white/5 p-5 hover:border-white/30"
                >
                  <p className="text-xs font-black uppercase text-red-300">
                    {brand.origin}
                  </p>
                  <p className="mt-2 text-lg font-black">{brand.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {brand.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {documents.map((document) => (
                <Link
                  href="/brands"
                  key={document.id}
                  className="rounded bg-white p-4 text-ink"
                >
                  <p className="text-sm font-black">{document.title}</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {document.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto grid max-w-7xl gap-10 py-16 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <SectionHeading
            eyebrow="Knowledge"
            title="Tin tức và kiến thức"
            description="Nền tảng SEO quan trọng cho website trưng bày sản phẩm dinh dưỡng thể thao."
          />
          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <Link
                href={`/knowledge/${post.slug}`}
                key={post.id}
                className="rounded border border-line p-5 hover:border-brand-red"
              >
                <p className="text-xs font-black uppercase text-brand-red">
                  {post.category}
                </p>
                <h3 className="mt-2 text-xl font-black text-ink">{post.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Reviews" title="Đánh giá khách hàng" />
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded border border-line bg-surface p-6"
              >
                <div className="mb-4 flex gap-1 text-brand-gold">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-7 text-ink">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-5">
                  <p className="font-black">{testimonial.name}</p>
                  <p className="text-sm text-muted">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
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
