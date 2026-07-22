import type {
  BlogPost,
  Brand,
  Category,
  Dealer,
  DocumentAsset,
  Product,
  Testimonial,
} from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat_energy",
    name: { vi: "Gel năng lượng", en: "Energy Gel" },
    slug: "energy",
    description: {
      vi: "Bổ sung năng lượng nhanh cho chạy bộ, đạp xe và các buổi tập dài.",
      en: "Quick energy support for running, cycling and long training sessions.",
    },
  },
  {
    id: "cat_hydration",
    name: { vi: "Điện giải", en: "Electrolyte" },
    slug: "hydration",
    description: {
      vi: "Hỗ trợ bù khoáng, duy trì hiệu suất và hạn chế chuột rút.",
      en: "Mineral support for hydration, performance and cramp prevention.",
    },
  },
  {
    id: "cat_protein",
    name: { vi: "Protein", en: "Protein" },
    slug: "protein",
    description: {
      vi: "Bổ sung protein cho phục hồi sau tập và khẩu phần hằng ngày.",
      en: "Protein support for recovery and daily nutrition.",
    },
  },
  {
    id: "cat_recovery",
    name: { vi: "Phục hồi", en: "Recovery" },
    slug: "recovery",
    description: {
      vi: "Công thức phục hồi sau vận động cường độ cao hoặc thời lượng dài.",
      en: "Recovery formulas after intense or long-duration exercise.",
    },
  },
  {
    id: "cat_vitamin",
    name: { vi: "Vitamin & Supplement", en: "Vitamin & Supplement" },
    slug: "vitamin",
    description: {
      vi: "Vi chất và supplement nền hỗ trợ sức khỏe cho người tập luyện.",
      en: "Micronutrients and daily supplements for active lifestyles.",
    },
  },
  {
    id: "cat_weight",
    name: { vi: "Quản lý cân nặng", en: "Weight Management" },
    slug: "weight-management",
    description: {
      vi: "Sản phẩm hỗ trợ kiểm soát cân nặng theo mục tiêu tập luyện.",
      en: "Products that support weight management and training goals.",
    },
  },
];

export const products: Product[] = [
  {
    id: "prd_energy-gel-citrus",
    name: { vi: "Endurance Gel Citrus", en: "Endurance Gel Citrus" },
    slug: "endurance-gel-citrus",
    brand: "ProFuel",
    categoryId: "cat_energy",
    categoryName: { vi: "Gel năng lượng", en: "Energy Gel" },
    origin: "USA",
    price: 45000,
    sizes: ["35g", "Box 24"],
    flavors: [
      { vi: "Cam chanh", en: "Citrus" },
      { vi: "Dâu rừng", en: "Berry" },
      { vi: "Cola", en: "Cola" },
    ],
    primaryGoal: { vi: "Năng lượng", en: "Energy" },
    shortDescription: {
      vi: "Gel năng lượng dễ dùng cho runner, cyclist và triathlete trong buổi tập dài.",
      en: "Easy-to-use energy gel for runners, cyclists and triathletes during long sessions.",
    },
    visual: {
      packageType: "gel",
      accent: "#ce1732",
      background: "#fff1f2",
      badge: { vi: "Race fuel", en: "Race fuel" },
    },
    benefits: [
      {
        vi: "Bổ sung năng lượng nhanh trong lúc vận động.",
        en: "Supports quick energy intake during exercise.",
      },
      {
        vi: "Dễ mang theo khi chạy bộ hoặc đạp xe.",
        en: "Easy to carry for running or cycling.",
      },
      {
        vi: "Phù hợp cho buổi tập từ 60 phút trở lên.",
        en: "Suitable for sessions lasting 60 minutes or more.",
      },
    ],
    ingredients: [
      { name: "Carbohydrate", amount: "23g" },
      { name: "Sodium", amount: "90mg" },
      { name: "Potassium", amount: "35mg" },
    ],
    variants: [],
    usage: [
      {
        vi: "Dùng 1 gói trước hoặc trong khi tập.",
        en: "Take 1 sachet before or during training.",
      },
      {
        vi: "Uống kèm nước để hỗ trợ hấp thụ.",
        en: "Drink with water for better absorption.",
      },
    ],
    audience: [
      { vi: "Runner", en: "Runner" },
      { vi: "Cyclist", en: "Cyclist" },
      { vi: "Triathlete", en: "Triathlete" },
    ],
    relatedProductIds: ["prd_electrolyte-tabs", "prd_recovery-drink"],
    isFeatured: true,
    isBestSeller: true,
    badgeType: "best_seller",
  },
  {
    id: "prd_electrolyte-tabs",
    name: { vi: "Electrolyte Tabs", en: "Electrolyte Tabs" },
    slug: "electrolyte-tabs",
    brand: "HydraMax",
    categoryId: "cat_hydration",
    categoryName: { vi: "Điện giải", en: "Electrolyte" },
    origin: "Germany",
    price: 320000,
    sizes: ["Tube 20 tablets"],
    flavors: [
      { vi: "Chanh vàng", en: "Lemon" },
      { vi: "Cam", en: "Orange" },
    ],
    primaryGoal: { vi: "Bù khoáng", en: "Hydration" },
    shortDescription: {
      vi: "Viên sủi điện giải cho buổi tập ra nhiều mồ hôi hoặc thi đấu ngoài trời.",
      en: "Electrolyte tablets for heavy sweating sessions or outdoor racing.",
    },
    visual: {
      packageType: "tube",
      accent: "#0f766e",
      background: "#ecfdf5",
      badge: { vi: "Electrolytes", en: "Electrolytes" },
    },
    benefits: [
      {
        vi: "Bổ sung sodium, potassium và magnesium.",
        en: "Provides sodium, potassium and magnesium.",
      },
      {
        vi: "Hỗ trợ duy trì nước và khoáng trong lúc tập.",
        en: "Supports fluid and mineral balance during exercise.",
      },
      {
        vi: "Dễ pha với bình nước tập luyện.",
        en: "Easy to mix in a training bottle.",
      },
    ],
    ingredients: [
      { name: "Sodium", amount: "250mg" },
      { name: "Potassium", amount: "80mg" },
      { name: "Magnesium", amount: "45mg" },
    ],
    variants: [],
    usage: [
      {
        vi: "Pha 1 viên với 500-750ml nước.",
        en: "Dissolve 1 tablet in 500-750ml of water.",
      },
      {
        vi: "Dùng trước và trong khi tập.",
        en: "Use before and during training.",
      },
    ],
    audience: [
      { vi: "Runner", en: "Runner" },
      { vi: "Cyclist", en: "Cyclist" },
      { vi: "Thể thao ngoài trời", en: "Outdoor sports" },
    ],
    relatedProductIds: ["prd_energy-gel-citrus", "prd_recovery-drink"],
    isFeatured: true,
    isBestSeller: true,
    badgeType: "best_seller",
  },
  {
    id: "prd_whey-protein",
    name: { vi: "Whey Protein Isolate", en: "Whey Protein Isolate" },
    slug: "whey-protein-isolate",
    brand: "NutriCore",
    categoryId: "cat_protein",
    categoryName: { vi: "Protein", en: "Protein" },
    origin: "New Zealand",
    price: 1250000,
    sizes: ["900g", "2.2kg"],
    flavors: [
      { vi: "Chocolate", en: "Chocolate" },
      { vi: "Vanilla", en: "Vanilla" },
    ],
    primaryGoal: { vi: "Protein", en: "Protein" },
    shortDescription: {
      vi: "Protein isolate cho phục hồi sau tập và bổ sung protein trong khẩu phần.",
      en: "Protein isolate for post-workout recovery and daily protein intake.",
    },
    visual: {
      packageType: "tub",
      accent: "#1f2937",
      background: "#f1f5f9",
      badge: { vi: "25g protein", en: "25g protein" },
    },
    benefits: [
      {
        vi: "Hàm lượng protein cao.",
        en: "High protein content.",
      },
      {
        vi: "Hỗ trợ phục hồi cơ sau tập.",
        en: "Supports muscle recovery after training.",
      },
      {
        vi: "Dễ pha, phù hợp dùng sau tập.",
        en: "Easy to mix and suitable after workouts.",
      },
    ],
    ingredients: [
      { name: "Protein", amount: "25g" },
      { name: "BCAA", amount: "5.5g" },
      { name: "Sugar", amount: "1g" },
    ],
    variants: [],
    usage: [
      {
        vi: "Pha 1 muỗng với 250ml nước hoặc sữa.",
        en: "Mix 1 scoop with 250ml water or milk.",
      },
      {
        vi: "Dùng sau tập hoặc như bữa phụ.",
        en: "Use after training or as a protein snack.",
      },
    ],
    audience: [
      { vi: "Gym", en: "Gym" },
      { vi: "Người cần bổ sung protein", en: "Protein supplementation" },
    ],
    relatedProductIds: ["prd_recovery-drink"],
    isFeatured: true,
    isBestSeller: true,
    badgeType: "best_seller",
  },
  {
    id: "prd_recovery-drink",
    name: { vi: "Recovery Drink Mix", en: "Recovery Drink Mix" },
    slug: "recovery-drink-mix",
    brand: "ProFuel",
    categoryId: "cat_recovery",
    categoryName: { vi: "Phục hồi", en: "Recovery" },
    origin: "USA",
    price: 780000,
    sizes: ["600g"],
    flavors: [
      { vi: "Dâu rừng", en: "Berry" },
      { vi: "Xoài", en: "Mango" },
    ],
    primaryGoal: { vi: "Phục hồi", en: "Recovery" },
    shortDescription: {
      vi: "Công thức phục hồi sau buổi tập dài với carbohydrate, protein và điện giải.",
      en: "Recovery formula with carbohydrates, protein and electrolytes after long sessions.",
    },
    visual: {
      packageType: "pouch",
      accent: "#c9972f",
      background: "#fffbeb",
      badge: { vi: "Sau tập", en: "Post-workout" },
    },
    benefits: [
      {
        vi: "Hỗ trợ nạp lại glycogen.",
        en: "Supports glycogen replenishment.",
      },
      {
        vi: "Bổ sung protein cho phục hồi cơ.",
        en: "Provides protein for muscle recovery.",
      },
      {
        vi: "Phù hợp sau chạy dài hoặc đạp dài.",
        en: "Suitable after long runs or rides.",
      },
    ],
    ingredients: [
      { name: "Carbohydrate", amount: "38g" },
      { name: "Protein", amount: "12g" },
      { name: "Sodium", amount: "180mg" },
    ],
    variants: [],
    usage: [
      {
        vi: "Dùng trong vòng 30-60 phút sau tập.",
        en: "Use within 30-60 minutes after training.",
      },
      {
        vi: "Pha với 300ml nước lạnh.",
        en: "Mix with 300ml cold water.",
      },
    ],
    audience: [
      { vi: "Runner", en: "Runner" },
      { vi: "Cyclist", en: "Cyclist" },
      { vi: "Triathlete", en: "Triathlete" },
    ],
    relatedProductIds: ["prd_energy-gel-citrus", "prd_whey-protein"],
    isFeatured: true,
    isBestSeller: false,
    badgeType: "none",
  },
];

export const brands: Brand[] = [
  {
    id: "brand_profuel",
    name: "ProFuel",
    slug: "profuel",
    origin: "USA",
    description: {
      vi: "Dòng sản phẩm năng lượng và phục hồi cho vận động sức bền.",
      en: "Energy and recovery products for endurance sports.",
    },
    documentCount: 6,
  },
  {
    id: "brand_hydramax",
    name: "HydraMax",
    slug: "hydramax",
    origin: "Germany",
    description: {
      vi: "Giải pháp điện giải và hydration cho tập luyện ngoài trời.",
      en: "Electrolyte and hydration solutions for outdoor training.",
    },
    documentCount: 4,
  },
  {
    id: "brand_nutricore",
    name: "NutriCore",
    slug: "nutricore",
    origin: "New Zealand",
    description: {
      vi: "Protein và supplement nền cho người tập luyện đều đặn.",
      en: "Protein and daily supplements for regular training.",
    },
    documentCount: 5,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "tst_runner",
    name: "Minh Anh",
    role: "Marathon runner",
    rating: 5,
    quote: {
      vi: "Mình dễ chọn sản phẩm hơn khi có giá, vị và cách dùng rõ ràng.",
      en: "It is easier to choose products when price, flavors and usage are clear.",
    },
  },
  {
    id: "tst_cyclist",
    name: "Quốc Huy",
    role: "Cyclist",
    rating: 5,
    quote: {
      vi: "Thông tin sản phẩm gọn, dễ xem và có hotline để hỏi nhanh.",
      en: "Product information is concise, easy to review and has a hotline for quick advice.",
    },
  },
];

export const dealers: Dealer[] = [
  {
    id: "dealer_hcm",
    name: "Pro-Fitness Ho Chi Minh",
    city: "Ho Chi Minh City",
    address: "District 1, Ho Chi Minh City",
    phone: "02838481014",
  },
  {
    id: "dealer_hanoi",
    name: "Pro-Fitness Ha Noi Partner",
    city: "Ha Noi",
    address: "Ba Dinh, Ha Noi",
    phone: "02838481014",
  },
];

export const documents: DocumentAsset[] = [
  {
    id: "doc_catalog",
    title: { vi: "Catalog sản phẩm", en: "Product catalog" },
    type: "catalog",
    description: {
      vi: "Tổng quan danh mục sản phẩm và thương hiệu phân phối.",
      en: "Overview of products and distributed brands.",
    },
  },
  {
    id: "doc_certificate",
    title: { vi: "Chứng nhận phân phối", en: "Distribution certificate" },
    type: "certificate",
    description: {
      vi: "Tài liệu xác thực thương hiệu và giấy tờ phân phối.",
      en: "Brand verification and distribution documents.",
    },
  },
  {
    id: "doc_attp",
    title: { vi: "Công bố ATTP", en: "Food safety declaration" },
    type: "attp",
    description: {
      vi: "Bộ tài liệu minh bạch cho sản phẩm thực phẩm bổ sung.",
      en: "Compliance documents for supplement products.",
    },
  },
];

export const blogPosts: BlogPost[] = [];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
