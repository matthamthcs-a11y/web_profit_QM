"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateOrderItemInput = {
  productId: string;
  variantId?: string | null;
  productName: string;
  variantLabel?: string | null;
  price: number;
  quantity: number;
  imagePath?: string | null;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  provinceCity?: string | null;
  district?: string | null;
  paymentPreference: "cod" | "bank_transfer";
  customerNotes?: string | null;
  items: CreateOrderItemInput[];
  sourceDomain?: string;
};

export type CreateOrderResult =
  | { success: true; orderCode: string }
  | { success: false; error: string };

function generateOrderCode(source = "PF"): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  return `${source}-${year}${month}${day}-${randomSuffix}`;
}

export async function createOrderAction(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  try {
    const customerName = input.customerName?.trim();
    const customerPhone = input.customerPhone?.trim();
    const shippingAddress = input.shippingAddress?.trim();

    if (!customerName) {
      return { success: false, error: "Vui lòng nhập họ và tên người nhận." };
    }

    if (!customerPhone) {
      return { success: false, error: "Vui lòng nhập số điện thoại." };
    }

    // Validate phone number format (basic VN phone)
    const phoneClean = customerPhone.replace(/\s+/g, "");
    if (!/^(0|\+84)[0-9]{9,10}$/.test(phoneClean)) {
      return {
        success: false,
        error: "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại 10 chữ số.",
      };
    }

    if (!shippingAddress) {
      return { success: false, error: "Vui lòng nhập địa chỉ nhận hàng." };
    }

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "Giỏ hàng của bạn đang trống." };
    }

    const subtotal = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingFee = 0;
    const totalAmount = subtotal + shippingFee;

    const sourcePrefix = input.sourceDomain?.includes("hammer") ? "HN" : "PF";
    const orderCode = generateOrderCode(sourcePrefix);

    const supabase = await createSupabaseServerClient();

    // 1. Insert order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: input.customerEmail?.trim() || null,
        shipping_address: shippingAddress,
        province_city: input.provinceCity?.trim() || null,
        district: input.district?.trim() || null,
        payment_preference: input.paymentPreference || "cod",
        customer_notes: input.customerNotes?.trim() || null,
        subtotal,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        status: "new",
        source_domain: input.sourceDomain || "profitness",
      })
      .select("id, order_code")
      .single();

    if (orderError || !orderData) {
      console.error("Order creation error:", orderError);
      return {
        success: false,
        error:
          orderError?.message ||
          "Không thể tạo đơn hàng lúc này. Vui lòng thử lại sau.",
      };
    }

    // 2. Insert order items
    const orderItemsPayload = input.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.productId || null,
      variant_id: item.variantId || null,
      product_name: item.productName,
      variant_label: item.variantLabel || null,
      price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      image_path: item.imagePath || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      // We don't necessarily abort since main order is already created, but we log
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");

    return { success: true, orderCode: orderData.order_code };
  } catch (error) {
    console.error("Unexpected order creation error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tạo đơn hàng.",
    };
  }
}

