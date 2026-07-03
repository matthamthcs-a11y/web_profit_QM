import type { Product } from "@/lib/types";

type ProductVisualProps = {
  product: Product;
  size?: "card" | "hero";
};

export function ProductVisual({ product, size = "card" }: ProductVisualProps) {
  const isHero = size === "hero";
  const shellSize = isHero ? "h-[27rem] w-full max-w-sm" : "h-52 w-full";
  const packageSize = isHero ? "h-80 w-52" : "h-36 w-28";

  return (
    <div
      className={`relative flex ${shellSize} items-center justify-center overflow-hidden rounded bg-surface`}
      style={{ backgroundColor: product.visual.background }}
    >
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20"
        style={{ backgroundColor: product.visual.accent }}
      />
      <div
        className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full opacity-15"
        style={{ backgroundColor: product.visual.accent }}
      />
      <div className="absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase text-ink shadow-sm">
        {product.visual.badge}
      </div>
      <PackageShape product={product} className={packageSize} />
    </div>
  );
}

function PackageShape({
  product,
  className,
}: {
  product: Product;
  className: string;
}) {
  const common =
    "relative flex flex-col justify-between border border-black/10 bg-white p-4 shadow-soft";

  if (product.visual.packageType === "tube") {
    return (
      <div
        className={`${className} ${common} rounded-full`}
        style={{ borderColor: product.visual.accent }}
      >
        <ProductLabel product={product} compact />
      </div>
    );
  }

  if (product.visual.packageType === "tub") {
    return (
      <div className={`${className} relative flex items-end justify-center`}>
        <div className="absolute top-0 h-10 w-44 rounded-t border border-black/10 bg-slate-900" />
        <div className={`${common} h-64 w-52 rounded-b rounded-t-sm pt-12`}>
          <ProductLabel product={product} />
        </div>
      </div>
    );
  }

  if (product.visual.packageType === "pouch") {
    return (
      <div
        className={`${className} ${common} rounded-b-3xl rounded-t-lg`}
        style={{ borderColor: product.visual.accent }}
      >
        <div className="absolute left-5 right-5 top-4 h-2 rounded-full bg-black/10" />
        <ProductLabel product={product} />
      </div>
    );
  }

  return (
    <div
      className={`${className} ${common} rounded-b-2xl rounded-t-md`}
      style={{ borderColor: product.visual.accent }}
    >
      <ProductLabel product={product} />
    </div>
  );
}

function ProductLabel({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  return (
    <>
      <span
        className="text-xs font-black uppercase"
        style={{ color: product.visual.accent }}
      >
        {product.brand}
      </span>
      <span
        className={`${compact ? "text-lg" : "text-2xl"} font-black leading-tight text-ink`}
      >
        {product.name}
      </span>
      <span className="text-xs font-black uppercase text-muted">
        {product.primaryGoal}
      </span>
    </>
  );
}
