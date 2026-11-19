import type { Metadata } from "next";
import { AdminOrdersManager } from "@/components/admin-orders-manager";
import { AdminPageHeader } from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminOrdersPage } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Đơn hàng",
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const initialData = await getAdminOrdersPage({ limit: 25, offset: 0 });

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="E-Commerce"
        title="Quản lý Đơn hàng"
        description="Theo dõi, gọi điện tư vấn và xử lý đơn hàng từ website Profitness & Hammer Nutrition."
      />

      <AdminOrdersManager initialData={initialData} />
    </section>
  );
}
