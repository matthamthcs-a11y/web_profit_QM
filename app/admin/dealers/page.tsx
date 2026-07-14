import type { Metadata } from "next";
import { deleteDealer, upsertDealer } from "@/app/admin/actions";
import {
  AdminCheckbox,
  AdminDeleteButton,
  AdminField,
  AdminPageHeader,
  AdminSubmit,
} from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminDealers } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Dealers",
};

export default async function AdminDealersPage() {
  await requireAdmin();
  const dealers = await getAdminDealers();

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Sales"
        title="Đại lý"
        description="Quản lý thông tin đại lý, hotline, Zalo và map URL."
      />
      <details className="mt-6 rounded border border-line p-5" open>
        <summary className="cursor-pointer text-lg font-black">
          Thêm đại lý mới
        </summary>
        <DealerForm position={dealers.length + 1} />
      </details>
      <div className="mt-8 grid gap-4">
        {dealers.map((dealer, index) => (
          <details key={dealer.id} className="rounded border border-line p-5">
            <summary className="cursor-pointer font-black">
              {dealer.name}{" "}
              <span className="text-sm font-semibold text-muted">
                / {dealer.city}
              </span>
            </summary>
            <DealerForm dealer={dealer} position={index + 1} />
            <form action={deleteDealer} className="mt-4">
              <input type="hidden" name="id" value={dealer.id} />
              <AdminDeleteButton />
            </form>
          </details>
        ))}
      </div>
    </section>
  );
}

function DealerForm({
  dealer,
  position,
}: {
  dealer?: Awaited<ReturnType<typeof getAdminDealers>>[number];
  position: number;
}) {
  return (
    <form action={upsertDealer} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={dealer?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminField label="Tên" name="name" defaultValue={dealer?.name} required />
        <AdminField label="Thành phố" name="city" defaultValue={dealer?.city} />
        <AdminField label="Số điện thoại" name="phone" defaultValue={dealer?.phone} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <AdminField label="Địa chỉ" name="address" defaultValue={dealer?.address} />
        <AdminField label="Zalo" name="zalo" defaultValue={dealer?.zalo} />
        <AdminField label="Map URL" name="map_url" defaultValue={dealer?.map_url} />
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <AdminField
          label="Vị trí hiển thị"
          name="sort_order"
          type="number"
          defaultValue={position}
          min={1}
        />
        <AdminCheckbox
          label="Đang hiển thị"
          name="is_active"
          defaultChecked={dealer?.is_active ?? true}
        />
      </div>
      <AdminSubmit />
    </form>
  );
}
