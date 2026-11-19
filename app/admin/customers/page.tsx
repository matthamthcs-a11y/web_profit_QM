import type { Metadata } from "next";
import { AdminCustomersManager } from "@/components/admin-customers-manager";
import { AdminPageHeader } from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminCustomers } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Quản lý Khách hàng | Admin",
  description:
    "Quản lý hồ sơ khách hàng, tra cứu lịch sử mua hàng và xuất file Excel.",
};

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await getAdminCustomers();

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="CRM & Khách hàng"
        title="Quản lý Khách hàng"
        description="Danh sách khách hàng từ Hammer Nutrition & Pro-Fitness, tự động tổng hợp số đơn hàng, tổng chi tiêu và hỗ trợ xuất file Excel."
      />

      <AdminCustomersManager customers={customers} />
    </section>
  );
}
