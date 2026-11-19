import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { getAdminCustomersPage } from "@/lib/admin/data";

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
  const source = sp.get("source") || "all";
  const segment = sp.get("segment") || "all";

  const { customers } = await getAdminCustomersPage({
    search,
    source,
    segment,
    limit: 5000,
    offset: 0,
  });

  const headers = [
    "Họ và tên",
    "Số điện thoại",
    "Email",
    "Địa chỉ",
    "Nguồn",
    "Số đơn hàng",
    "Tổng chi tiêu (VNĐ)",
    "Đơn hàng gần nhất",
    "Ngày khởi tạo",
    "Ghi chú CSKH",
  ];

  const rows = customers.map((c) => {
    const sourceText = (c.source_domain || "").toLowerCase().includes("hammer")
      ? "Hammer Nutrition"
      : "Pro-Fitness";
    return [
      csvEscape(c.full_name),
      c.phone ? csvEscape(`'${c.phone}`) : '""',
      csvEscape(c.email || ""),
      csvEscape(c.address || ""),
      csvEscape(sourceText),
      c.order_count,
      c.total_spent,
      c.last_order_at
        ? csvEscape(new Date(c.last_order_at).toLocaleString("vi-VN"))
        : '""',
      csvEscape(new Date(c.created_at).toLocaleString("vi-VN")),
      csvEscape(c.notes || ""),
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const dateStr = new Date().toISOString().slice(0, 10);

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="khach_hang_${dateStr}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
