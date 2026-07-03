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
    name: "Energy Gel",
    slug: "energy",
    description: "Gel năng lượng và sản phẩm bổ sung carbohydrate cho buổi tập dài.",
  },
  {
    id: "cat_hydration",
    name: "Electrolyte",
    slug: "hydration",
    description: "Điện giải hỗ trợ bù khoáng, hạn chế chuột rút và duy trì hiệu suất.",
  },
  {
    id: "cat_protein",
    name: "Protein",
    slug: "protein",
    description: "Protein sau tập, hỗ trợ phục hồi và phát triển cơ.",
  },
  {
    id: "cat_recovery",
    name: "Recovery",
    slug: "recovery",
    description: "Sản phẩm phục hồi sau vận động cường độ cao.",
  },
  {
    id: "cat_vitamin",
    name: "Vitamin & Supplement",
    slug: "vitamin",
    description: "Vi chất, vitamin và supplement hỗ trợ sức khỏe nền.",
  },
  {
    id: "cat_weight",
    name: "Weight Management",
    slug: "weight-management",
    description: "Sản phẩm hỗ trợ kiểm soát cân nặng và chế độ tập luyện.",
  },
];

export const products: Product[] = [
  {
    id: "prd_energy-gel-citrus",
    name: "Endurance Gel Citrus",
    slug: "endurance-gel-citrus",
    brand: "ProFuel",
    categoryId: "cat_energy",
    categoryName: "Energy Gel",
    origin: "USA",
    sizes: ["35g", "Box 24"],
    flavors: ["Citrus", "Berry", "Cola"],
    primaryGoal: "Energy",
    shortDescription:
      "Gel năng lượng dễ dùng cho runner, cyclist và triathlete trong buổi tập dài.",
    visual: {
      packageType: "gel",
      accent: "#ce1732",
      background: "#fff1f2",
      badge: "Race fuel",
    },
    benefits: [
      "Bổ sung năng lượng nhanh trong lúc vận động",
      "Dễ mang theo khi chạy bộ hoặc đạp xe",
      "Phù hợp cho buổi tập từ 60 phút trở lên",
    ],
    ingredients: ["Maltodextrin", "Fructose", "Sodium", "Potassium"],
    usage: [
      "Dùng 1 gói trước hoặc trong khi tập.",
      "Uống kèm nước để hấp thụ tốt hơn.",
    ],
    audience: ["Runner", "Cyclist", "Triathlete", "Gym endurance"],
    faq: [
      {
        question: "Dùng trước hay trong lúc tập?",
        answer: "Có thể dùng trước 10-15 phút hoặc chia đều trong buổi tập dài.",
      },
      {
        question: "Có cần uống nước kèm không?",
        answer: "Nên uống kèm nước để hỗ trợ tiêu hóa và hấp thụ.",
      },
    ],
    relatedProductIds: ["prd_electrolyte-tabs", "prd_recovery-drink"],
    isFeatured: true,
  },
  {
    id: "prd_electrolyte-tabs",
    name: "Electrolyte Tabs",
    slug: "electrolyte-tabs",
    brand: "HydraMax",
    categoryId: "cat_hydration",
    categoryName: "Electrolyte",
    origin: "Germany",
    sizes: ["Tube 20 viên"],
    flavors: ["Lemon", "Orange"],
    primaryGoal: "Hydration",
    shortDescription:
      "Viên sủi điện giải cho buổi tập ra nhiều mồ hôi hoặc thi đấu ngoài trời.",
    visual: {
      packageType: "tube",
      accent: "#0f766e",
      background: "#ecfdf5",
      badge: "Electrolytes",
    },
    benefits: [
      "Bổ sung sodium, potassium và magnesium",
      "Hỗ trợ duy trì nước và khoáng",
      "Dễ pha với bình nước tập luyện",
    ],
    ingredients: ["Sodium", "Potassium", "Magnesium", "Vitamin C"],
    usage: ["Pha 1 viên với 500-750ml nước.", "Dùng trước và trong khi tập."],
    audience: ["Runner", "Cyclist", "Trail runner", "Outdoor sports"],
    faq: [
      {
        question: "Có dùng hằng ngày được không?",
        answer: "Nên dùng theo nhu cầu vận động và lượng mồ hôi thực tế.",
      },
    ],
    relatedProductIds: ["prd_energy-gel-citrus", "prd_amino-recovery"],
    isFeatured: true,
  },
  {
    id: "prd_whey-protein",
    name: "Whey Protein Isolate",
    slug: "whey-protein-isolate",
    brand: "NutriCore",
    categoryId: "cat_protein",
    categoryName: "Protein",
    origin: "New Zealand",
    sizes: ["900g", "2.2kg"],
    flavors: ["Chocolate", "Vanilla"],
    primaryGoal: "Protein",
    shortDescription:
      "Protein isolate cho phục hồi sau tập và bổ sung protein trong khẩu phần.",
    visual: {
      packageType: "tub",
      accent: "#1f2937",
      background: "#f1f5f9",
      badge: "25g protein",
    },
    benefits: [
      "Hàm lượng protein cao",
      "Hỗ trợ phục hồi cơ sau tập",
      "Dễ pha, phù hợp dùng sau tập",
    ],
    ingredients: ["Whey protein isolate", "Cocoa powder", "Lecithin"],
    usage: ["Pha 1 muỗng với 250ml nước hoặc sữa.", "Dùng sau tập hoặc bữa phụ."],
    audience: ["Gym", "Runner", "Người cần bổ sung protein"],
    faq: [
      {
        question: "Người mới tập có dùng được không?",
        answer: "Có, nếu cần bổ sung protein và không dị ứng với sữa.",
      },
    ],
    relatedProductIds: ["prd_recovery-drink", "prd_daily-vitamin"],
    isFeatured: true,
  },
  {
    id: "prd_recovery-drink",
    name: "Recovery Drink Mix",
    slug: "recovery-drink-mix",
    brand: "ProFuel",
    categoryId: "cat_recovery",
    categoryName: "Recovery",
    origin: "USA",
    sizes: ["600g"],
    flavors: ["Berry", "Mango"],
    primaryGoal: "Recovery",
    shortDescription:
      "Công thức phục hồi sau buổi tập dài với carbohydrate, protein và điện giải.",
    visual: {
      packageType: "pouch",
      accent: "#c9972f",
      background: "#fffbeb",
      badge: "Post-workout",
    },
    benefits: [
      "Hỗ trợ nạp lại glycogen",
      "Bổ sung protein cho phục hồi cơ",
      "Phù hợp sau chạy dài hoặc đạp dài",
    ],
    ingredients: ["Carbohydrate blend", "Whey protein", "Sodium", "BCAA"],
    usage: ["Dùng trong vòng 30-60 phút sau tập.", "Pha với 300ml nước lạnh."],
    audience: ["Runner", "Cyclist", "Triathlete"],
    faq: [
      {
        question: "Có thay bữa ăn được không?",
        answer: "Không nên xem là bữa ăn chính; dùng như sản phẩm hỗ trợ phục hồi.",
      },
    ],
    relatedProductIds: ["prd_energy-gel-citrus", "prd_whey-protein"],
    isFeatured: true,
  },
];

export const brands: Brand[] = [
  {
    id: "brand_profuel",
    name: "ProFuel",
    slug: "profuel",
    origin: "USA",
    description: "Dòng sản phẩm năng lượng và phục hồi cho vận động sức bền.",
    documentCount: 6,
  },
  {
    id: "brand_hydramax",
    name: "HydraMax",
    slug: "hydramax",
    origin: "Germany",
    description: "Giải pháp điện giải và hydration cho tập luyện ngoài trời.",
    documentCount: 4,
  },
  {
    id: "brand_nutricore",
    name: "NutriCore",
    slug: "nutricore",
    origin: "New Zealand",
    description: "Protein và supplement nền cho người tập luyện đều đặn.",
    documentCount: 5,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "post_energy-gel",
    title: "Cách dùng gel năng lượng cho buổi chạy dài",
    slug: "cach-dung-gel-nang-luong-cho-buoi-chay-dai",
    category: "Dinh dưỡng thể thao",
    excerpt:
      "Gợi ý thời điểm dùng gel, cách uống nước kèm và các lỗi thường gặp khi chạy dài.",
    publishedAt: "2026-06-20",
    readingMinutes: 5,
  },
  {
    id: "post_electrolyte",
    title: "Điện giải là gì và khi nào cần bổ sung?",
    slug: "dien-giai-la-gi-va-khi-nao-can-bo-sung",
    category: "Hydration",
    excerpt:
      "Hiểu đúng về sodium, potassium, magnesium và cách lựa chọn sản phẩm điện giải.",
    publishedAt: "2026-06-12",
    readingMinutes: 6,
  },
  {
    id: "post_protein",
    title: "Protein sau tập có cần thiết không?",
    slug: "protein-sau-tap-co-can-thiet-khong",
    category: "Recovery",
    excerpt:
      "Khi nào cần whey protein, khi nào chỉ cần điều chỉnh khẩu phần ăn hằng ngày.",
    publishedAt: "2026-06-04",
    readingMinutes: 4,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "tst_runner",
    name: "Minh Anh",
    role: "Marathon runner",
    rating: 5,
    quote:
      "Mình dễ chọn sản phẩm hơn khi có tư vấn theo cự ly và thời điểm sử dụng.",
  },
  {
    id: "tst_cyclist",
    name: "Quốc Huy",
    role: "Cyclist",
    rating: 5,
    quote:
      "Tài liệu thành phần và giấy tờ sản phẩm rõ ràng, rất tiện khi tư vấn cho CLB.",
  },
];

export const dealers: Dealer[] = [
  {
    id: "dealer_hcm",
    name: "Profitness Ho Chi Minh",
    city: "Ho Chi Minh City",
    address: "District 1, Ho Chi Minh City",
    phone: "0900 000 001",
  },
  {
    id: "dealer_hanoi",
    name: "Profitness Ha Noi Partner",
    city: "Ha Noi",
    address: "Ba Dinh, Ha Noi",
    phone: "0900 000 002",
  },
];

export const documents: DocumentAsset[] = [
  {
    id: "doc_catalog",
    title: "Catalog sản phẩm 2026",
    type: "catalog",
    description: "Tổng quan danh mục sản phẩm và thương hiệu phân phối.",
  },
  {
    id: "doc_certificate",
    title: "Chứng nhận phân phối",
    type: "certificate",
    description: "Tài liệu xác thực thương hiệu và giấy tờ nhập khẩu.",
  },
  {
    id: "doc_attp",
    title: "Công bố ATTP",
    type: "attp",
    description: "Bộ tài liệu minh bạch cho sản phẩm thực phẩm bổ sung.",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
