export type Locale = "vi" | "en";

export type LocalizedText = {
  vi: string;
  en: string;
};

export type Category = {
  id: string;
  name: LocalizedText;
  slug: string;
  description: LocalizedText;
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
  usage: LocalizedText[];
  audience: LocalizedText[];
  relatedProductIds: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
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
  city: string;
  address: string;
  phone: string;
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
