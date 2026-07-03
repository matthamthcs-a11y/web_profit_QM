import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, MessageCircle, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { getProductBySlug, products } from "@/lib/mock-data";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter((item) =>
    product.relatedProductIds.includes(item.id),
  );

  return (
    <article>
      <section className="bg-surface">
        <div className="container-px mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[0.85fr_1fr]">
          <div className="rounded border border-line bg-white p-5 shadow-sm">
            <ProductVisual product={product} size="hero" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-red">
              {product.categoryName}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-ink md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted">
              {product.shortDescription}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Info label="Thương hiệu" value={product.brand} />
              <Info label="Xuất xứ" value={product.origin} />
              <Info label="Size" value={product.sizes.join(", ")} />
              <Info label="Hương vị" value={product.flavors.join(", ")} />
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded bg-brand-red px-5 text-sm font-black text-white hover:bg-red-700"
            >
              <MessageCircle className="h-4 w-4" />
              Liên hệ tư vấn sản phẩm
            </Link>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-green" />
                Tài liệu minh bạch
              </span>
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4 text-brand-red" />
                Catalog/COA ở giai đoạn Supabase
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto grid max-w-7xl gap-8 py-14 lg:grid-cols-3">
        <DetailBlock title="Công dụng" items={product.benefits} />
        <DetailBlock title="Cách sử dụng" items={product.usage} />
        <DetailBlock title="Đối tượng phù hợp" items={product.audience} />
      </section>

      <section className="container-px mx-auto grid max-w-7xl gap-8 pb-14 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded border border-line p-6">
          <h2 className="text-2xl font-black text-ink">Thành phần</h2>
          <div className="mt-5 grid gap-3">
            {product.ingredients.map((ingredient) => (
              <div
                key={ingredient}
                className="flex items-center justify-between border-b border-line pb-3 text-sm"
              >
                <span className="font-bold text-ink">{ingredient}</span>
                <span className="text-muted">Mock nutrition facts</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded border border-line bg-surface p-6">
          <h2 className="text-2xl font-black text-ink">FAQ</h2>
          <div className="mt-5 grid gap-4">
            {product.faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-black text-ink">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="bg-surface py-14">
          <div className="container-px mx-auto max-w-7xl">
            <h2 className="mb-6 text-3xl font-black text-ink">
              Sản phẩm liên quan
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-white p-4">
      <p className="text-xs font-black uppercase text-muted">{label}</p>
      <p className="mt-2 font-bold text-ink">{value}</p>
    </div>
  );
}

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded border border-line p-6">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
