export type Locale = "vi" | "en";

export type LocalizedText = {
  vi: string;
  en: string;
};

export type ProductBadgeType =
  | "none"
  | "best_seller"
  | "recommended"
  | "new"
  | "featured";

export type ProductBadge = {
  id: string;
  label: LocalizedText;
  isActive: boolean;
  sortOrder: number;
};

export type Category = {
  id: string;
  name: LocalizedText;
  slug: string;
  description: LocalizedText;
};

export type FeatureBadge = {
  id: string;
  label: LocalizedText;
  imagePath: string;
  isActive: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: LocalizedText;
  slug: string;
  brand: string;
  categoryId: string;
  categoryName: LocalizedText;
  origin: string;
  price: number;
  listPrice?: number | null;
  sizes: string[];
  flavors: LocalizedText[];
  primaryGoal: LocalizedText;
  shortDescription: LocalizedText;
  imagePath?: string | null;
  nutritionImagePath?: string | null;
  visual: {
    packageType: "gel" | "tube" | "tub" | "pouch";
    accent: string;
    background: string;
    badge: LocalizedText;
  };
  benefits: LocalizedText[];
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  variants: ProductVariant[];
  usage: LocalizedText[];
  audience: LocalizedText[];
  relatedProductIds: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  badge: ProductBadge | null;
  badgeType: ProductBadgeType;
  featureBadges?: FeatureBadge[];
};

export type ProductVariant = {
  id: string;
  combinationKey: string;
  flavor: LocalizedText;
  flavorKey: string;
  size: LocalizedText;
  sizeKey: string;
  price?: number | null;
  listPrice?: number | null;
  currency?: string | null;
  imagePath?: string | null;
  nutritionImagePath?: string | null;
  isDefault: boolean;
  isPublished: boolean;
  sortOrder: number;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  origin: string;
  description: LocalizedText;
  documentCount: number;
  logoPath?: string | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: LocalizedText;
};

export type Dealer = {
  id: string;
  name: string;
  logoPath?: string | null;
};

export type DocumentAsset = {
  id: string;
  title: LocalizedText;
  type: "catalog" | "certificate" | "coa" | "attp";
  description: LocalizedText;
  filePath?: string | null;
  thumbnailPath?: string | null;
};

export type HomeBanner = {
  id: string;
  imagePath: string;
  mobileImagePath?: string | null;
  alt: LocalizedText;
  linkUrl?: string | null;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  slug: string;
  name: LocalizedText;
  flavor?: string | null;
  size?: string | null;
  price: number;
  imagePath?: string | null;
  quantity: number;
};

export type OrderStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  provinceCity?: string | null;
  district?: string | null;
  paymentPreference: "cod" | "bank_transfer";
  customerNotes?: string | null;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  staffNotes?: string | null;
  sourceDomain?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  variantLabel?: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  imagePath?: string | null;
  createdAt: string;
};
