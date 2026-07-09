import { cookies } from "next/headers";
import type { Locale, LocalizedText } from "@/lib/types";

export const DEFAULT_LOCALE: Locale = "vi";
export const HOTLINE = "02838481014";
export const ZALO_URL = `tel:${HOTLINE}`;

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("profitness_locale")?.value;
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

export function text(value: LocalizedText, locale: Locale) {
  return value[locale] || value.vi;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export const copy = {
  vi: {
    nav: {
      home: "Trang chủ",
      products: "Sản phẩm",
      about: "Giới thiệu",
      certificates: "Chứng nhận",
      dealers: "Đại lý",
      contact: "Liên hệ",
    },
    common: {
      search: "Tìm kiếm sản phẩm",
      consult: "Tư vấn",
      viewProducts: "Xem sản phẩm",
      viewDetail: "Xem chi tiết",
      callHotline: "Gọi hotline",
      messageZalo: "Nhắn Zalo",
      price: "Giá bán",
      flavors: "Hương vị",
      size: "Quy cách",
      brand: "Thương hiệu",
      category: "Nhóm sản phẩm",
      origin: "Xuất xứ",
      bestSeller: "Bán chạy",
      all: "Tất cả",
    },
    home: {
      eyebrow: "Sports Nutrition Catalog",
      title: "Pro-Fitness Sports Nutrition",
      description:
        "Website tham khảo sản phẩm dinh dưỡng thể thao: giá bán, hương vị, công dụng và cách sử dụng. Khách hàng có thể liên hệ nhanh với đội ngũ tư vấn để mua hàng trực tiếp.",
      categoriesTitle: "Danh mục nổi bật",
      categoriesDescription:
        "Tìm nhanh sản phẩm theo nhu cầu sử dụng: năng lượng, điện giải, protein, phục hồi và supplement nền.",
      bestSellersTitle: "Sản phẩm bán chạy",
      bestSellersDescription:
        "Các sản phẩm được ưu tiên hiển thị để khách hàng tham khảo nhanh giá, vị và công dụng.",
      trustTitle: "Tại sao chọn Pro-Fitness",
      trustDescription:
        "Tập trung vào sản phẩm chính hãng, thông tin rõ ràng và tư vấn nhanh qua hotline.",
      reviewsTitle: "Phản hồi khách hàng",
      reviewsDescription:
        "Tổng hợp những nhận xét ngắn gọn từ người dùng để khách hàng tham khảo nhanh trước khi liên hệ.",
    },
    products: {
      title: "Danh sách sản phẩm",
      description:
        "Lọc theo nhóm sản phẩm, thương hiệu hoặc tìm nhanh theo tên, công dụng và hương vị.",
      searchPlaceholder: "Gõ tên sản phẩm, công dụng hoặc hương vị...",
      noResults: "Không tìm thấy sản phẩm phù hợp. Hãy gọi hotline để được tư vấn.",
      filters: "Bộ lọc",
    },
    detail: {
      ingredients: "Bảng thành phần",
      benefits: "Công dụng",
      usage: "Cách sử dụng",
      audience: "Đối tượng phù hợp",
      related: "Sản phẩm liên quan",
      nutritionFacts: "Nutrition Facts",
      contactTitle: "Cần tư vấn sản phẩm này?",
    },
  },
  en: {
    nav: {
      home: "Home",
      products: "Products",
      about: "About",
      certificates: "Certificates",
      dealers: "Dealers",
      contact: "Contact",
    },
    common: {
      search: "Search products",
      consult: "Consult",
      viewProducts: "View products",
      viewDetail: "View details",
      callHotline: "Call hotline",
      messageZalo: "Message Zalo",
      price: "Price",
      flavors: "Flavors",
      size: "Size",
      brand: "Brand",
      category: "Category",
      origin: "Origin",
      bestSeller: "Best seller",
      all: "All",
    },
    home: {
      eyebrow: "Sports Nutrition Catalog",
      title: "Pro-Fitness Sports Nutrition",
      description:
        "A simple product catalog for sports nutrition: prices, flavors, benefits and usage instructions. Customers can quickly contact sales for direct consultation and purchase.",
      categoriesTitle: "Featured categories",
      categoriesDescription:
        "Find products by use case: energy, hydration, protein, recovery and everyday supplements.",
      bestSellersTitle: "Best-selling products",
      bestSellersDescription:
        "Priority products for customers to review prices, flavors and benefits quickly.",
      trustTitle: "Why choose Pro-Fitness",
      trustDescription:
        "Official products, clear product information and fast hotline consultation.",
      reviewsTitle: "Customer feedback",
      reviewsDescription:
        "A short summary of what customers say after reviewing product information and contacting the sales team.",
    },
    products: {
      title: "Product catalog",
      description:
        "Filter by product group, brand or search by name, benefit and flavor.",
      searchPlaceholder: "Type product name, benefit or flavor...",
      noResults: "No matching products found. Call the hotline for consultation.",
      filters: "Filters",
    },
    detail: {
      ingredients: "Ingredients",
      benefits: "Benefits",
      usage: "How to use",
      audience: "Suitable for",
      related: "Related products",
      nutritionFacts: "Nutrition Facts",
      contactTitle: "Need advice for this product?",
    },
  },
} as const;
