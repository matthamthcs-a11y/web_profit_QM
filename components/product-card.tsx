import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <ProductVisual product={product} />
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded bg-red-50 px-2.5 py-1 text-xs font-bold text-brand-red">
              {product.categoryName}
            </span>
            <span className="text-xs font-semibold text-muted">
              {product.origin}
            </span>
          </div>
          <h3 className="text-lg font-black text-ink">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {product.shortDescription}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-red">
            Xem chi tiết
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
