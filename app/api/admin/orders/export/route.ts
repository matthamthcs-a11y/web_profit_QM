import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { getAdminOrdersPage } from "@/lib/admin/data";

const statusLabelMap: Record<string, string> = {
  new: "Đơn mới (Chưa gọi)",
  contacted: "Đã liên hệ",
  confirmed: "Đã chốt đơn",
  shipping: "Đang giao hàng",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

function csvEscape(value: string | number | null | undefined) {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const search = sp.get("q") || "";
  const status = sp.get("status") || "all";
  const source = sp.get("source") || "all";

  const { orders } = await getAdminOrdersPage({
    search,
    status,
    source,
    limit: 5000,
    offset: 0,
  });

  const headers = [
    "Mã đơn hàng",
    "Nguồn web",
    "Ngày đặt",
    "Họ tên khách",
    "Số điện thoại",
    "Email",
    "Địa chỉ giao hàng",
    "Tỉnh/Thành",
    "Hình thức thanh toán",
    "Tạm tính (VNĐ)",
    "Phí ship (VNĐ)",
    "Tổng tiền (VNĐ)",
    "Trạng thái",
    "Sản phẩm đặt mua",
    "Ghi chú của khách",
    "Ghi chú nhân viên CSKH",
  ];

  const rows = orders.map((o) => {
    const itemsSummary = (o.order_items || [])
      .map(
        (item) =>
          `${item.product_name} (${item.variant_label || "Tiêu chuẩn"}) x${item.quantity}`,
      )
      .join(" | ");

    const statusText = statusLabelMap[o.status] || o.status;
    const paymentText =
      o.payment_preference === "bank_transfer"
        ? "Chuyển khoản ngân hàng"
        : "Thanh toán khi nhận hàng (COD)";
    const sourceText = (o.source_domain || "").toLowerCase().includes("hammer")
      ? "Hammer Nutrition"
      : "Pro-Fitness";

    return [
      csvEscape(o.order_code),
      csvEscape(sourceText),
      csvEscape(new Date(o.created_at).toLocaleString("vi-VN")),
      csvEscape(o.customer_name),
      csvEscape(`'${o.customer_phone}`),
      csvEscape(o.customer_email || ""),
      csvEscape(o.shipping_address),
      csvEscape(o.province_city || ""),
      csvEscape(paymentText),
      o.subtotal,
      o.shipping_fee,
      o.total_amount,
      csvEscape(statusText),
      csvEscape(itemsSummary),
      csvEscape(o.customer_notes || ""),
      csvEscape(o.staff_notes || ""),
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const dateStr = new Date().toISOString().slice(0, 10);

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="don_hang_${dateStr}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
