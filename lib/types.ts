export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  origin: string;
  sizes: string[];
  flavors: string[];
  primaryGoal: string;
  shortDescription: string;
  visual: {
    packageType: "gel" | "tube" | "tub" | "pouch";
    accent: string;
    background: string;
    badge: string;
  };
  benefits: string[];
  ingredients: string[];
  usage: string[];
  audience: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
  relatedProductIds: string[];
  isFeatured: boolean;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  origin: string;
  description: string;
  documentCount: number;
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
  quote: string;
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
  title: string;
  type: "catalog" | "certificate" | "coa" | "attp";
  description: string;
};
