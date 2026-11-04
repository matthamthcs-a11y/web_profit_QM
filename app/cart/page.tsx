import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Giỏ hàng & Đặt mua",
  description: "Xem lại danh sách sản phẩm dinh dưỡng thể thao đã chọn và điền thông tin đặt mua tư vấn nhanh chóng.",
};

export default function CartPage() {
  return <CartView />;
}

