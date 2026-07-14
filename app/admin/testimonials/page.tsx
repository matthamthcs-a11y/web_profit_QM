import type { Metadata } from "next";
import {
  deleteTestimonial,
  upsertTestimonial,
} from "@/app/admin/actions";
import {
  AdminCheckbox,
  AdminDeleteButton,
  AdminField,
  AdminPageHeader,
  AdminSubmit,
  LocalizedFields,
  localized,
} from "@/components/admin-fields";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminTestimonials } from "@/lib/admin/data";

export const metadata: Metadata = {
  title: "Admin Testimonials",
};

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const testimonials = await getAdminTestimonials();

  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <AdminPageHeader
        eyebrow="Social Proof"
        title="Phản hồi khách hàng"
        description="Quản lý đánh giá hiển thị ở trang chủ."
      />
      <details className="mt-6 rounded border border-line p-5" open>
        <summary className="cursor-pointer text-lg font-black">
          Thêm phản hồi mới
        </summary>
        <TestimonialForm position={testimonials.length + 1} />
      </details>
      <div className="mt-8 grid gap-4">
        {testimonials.map((testimonial, index) => (
          <details
            key={testimonial.id}
            className="rounded border border-line p-5"
          >
            <summary className="cursor-pointer font-black">
              {testimonial.name}{" "}
              <span className="text-sm font-semibold text-muted">
                / {localized(testimonial.quote, "vi")}
              </span>
            </summary>
            <TestimonialForm testimonial={testimonial} position={index + 1} />
            <form action={deleteTestimonial} className="mt-4">
              <input type="hidden" name="id" value={testimonial.id} />
              <AdminDeleteButton />
            </form>
          </details>
        ))}
      </div>
    </section>
  );
}

function TestimonialForm({
  testimonial,
  position,
}: {
  testimonial?: Awaited<ReturnType<typeof getAdminTestimonials>>[number];
  position: number;
}) {
  return (
    <form action={upsertTestimonial} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={testimonial?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-4">
        <AdminField
          label="Tên"
          name="name"
          defaultValue={testimonial?.name}
          required
        />
        <AdminField label="Vai trò" name="role" defaultValue={testimonial?.role} />
        <AdminField
          label="Rating"
          name="rating"
          type="number"
          defaultValue={testimonial?.rating ?? 5}
          min={1}
          max={5}
        />
        <AdminField
          label="Vị trí hiển thị"
          name="sort_order"
          type="number"
          defaultValue={position}
          min={1}
        />
      </div>
      <LocalizedFields
        base="quote"
        label="Nội dung"
        value={testimonial?.quote}
        textarea
      />
      <AdminCheckbox
        label="Đang xuất bản"
        name="is_published"
        defaultChecked={testimonial?.is_published ?? true}
      />
      <AdminSubmit />
    </form>
  );
}
