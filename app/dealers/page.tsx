import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { dealers } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Dealers",
  description: "He thong dai ly va form dang ky dai ly Profitness.",
};

export default function DealersPage() {
  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow="Dealers"
        title="Hệ thống đại lý"
        description="Khách hàng có thể tìm điểm tư vấn gần nhất hoặc gửi thông tin để đăng ký đại lý."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {dealers.map((dealer) => (
          <article key={dealer.id} className="rounded border border-line p-6">
            <h2 className="text-2xl font-black text-ink">{dealer.name}</h2>
            <p className="mt-2 text-sm font-bold uppercase text-brand-red">
              {dealer.city}
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4 text-brand-red" />
              {dealer.address}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Phone className="h-4 w-4 text-brand-red" />
              {dealer.phone}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-10 rounded bg-ink p-8 text-white">
        <h2 className="text-3xl font-black">Đăng ký đại lý</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Form thật sẽ được nối Supabase ở giai đoạn sau. Bản preview giữ CTA
          rõ ràng để khách hàng duyệt luồng nội dung.
        </p>
      </div>
    </section>
  );
}
