import type { Metadata } from "next";
import { deleteLead, updateLeadStatus } from "@/app/admin/actions";
import {
  AdminDeleteButton,
  AdminPageHeader,
  AdminSubmit,
} from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminLeads } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Leads",
};

export default async function AdminLeadsPage() {
  await requireAdmin();
  const leads = await getAdminLeads();

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Sales"
        title="Lead liên hệ"
        description="Xem và cập nhật trạng thái khách hàng gửi form tư vấn."
      />

      <div className="mt-8 grid gap-4">
        {leads.length === 0 ? (
          <p className="rounded border border-line p-5 text-sm font-semibold text-muted">
            Chưa có lead nào.
          </p>
        ) : null}
        {leads.map((lead) => (
          <article key={lead.id} className="rounded border border-line p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-black text-ink">
                    {lead.name || "Khách chưa nhập tên"}
                  </h2>
                  <span className="rounded bg-surface px-2.5 py-1 text-xs font-black uppercase text-muted">
                    {lead.status}
                  </span>
                  <span className="text-sm font-semibold text-muted">
                    {new Date(lead.created_at).toLocaleString("vi-VN")}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-ink">
                  {lead.phone} {lead.email ? `/ ${lead.email}` : ""}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {lead.message || "Không có nội dung."}
                </p>
                {lead.product_id ? (
                  <p className="mt-2 text-sm font-semibold text-muted">
                    Product ID: {lead.product_id}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <form action={updateLeadStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={lead.id} />
                  <select
                    name="status"
                    defaultValue={lead.status}
                    className="h-10 rounded border border-line px-3 text-sm font-bold"
                  >
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="closed">closed</option>
                    <option value="spam">spam</option>
                  </select>
                  <AdminSubmit label="Cập nhật" />
                </form>
                <form action={deleteLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <AdminDeleteButton />
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
