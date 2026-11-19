import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { getAdminOrdersPage } from "@/lib/admin/data";

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const search = sp.get("q") || "";
  const status = sp.get("status") || "all";
  const source = sp.get("source") || "all";
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(sp.get("limit")) || 25));
  const offset = (page - 1) * limit;

  const data = await getAdminOrdersPage({
    search,
    status,
    source,
    limit,
    offset,
  });

  return NextResponse.json(data);
}
