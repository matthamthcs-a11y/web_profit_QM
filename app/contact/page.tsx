import type { Metadata } from "next";
import { Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Lien he tu van san pham Profitness.",
};

export default function ContactPage() {
  return (
    <section className="container-px mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[0.8fr_1fr]">
      <div>
        <SectionHeading
          eyebrow="Contact"
          title="Liên hệ tư vấn"
          description="Bản preview hiển thị thông tin liên hệ và form mẫu. Form thật sẽ lưu vào Supabase sau khi chốt frontend."
        />
        <div className="grid gap-4">
          <ContactLine icon={Phone} label="Hotline" value="0900 000 000" />
          <ContactLine icon={Mail} label="Email" value="hello@profitness.vn" />
          <ContactLine icon={MessageCircle} label="Zalo OA" value="Profitness" />
          <ContactLine icon={Facebook} label="Facebook" value="Profitness Vietnam" />
          <ContactLine
            icon={MapPin}
            label="Văn phòng"
            value="Ho Chi Minh City, Vietnam"
          />
        </div>
      </div>

      <form className="rounded border border-line bg-surface p-6">
        <div className="grid gap-5">
          <Field label="Họ tên" placeholder="Nguyễn Văn A" />
          <Field label="Số điện thoại" placeholder="0900 000 000" />
          <Field label="Nhu cầu tư vấn" placeholder="Gel năng lượng cho marathon" />
          <label className="grid gap-2">
            <span className="text-sm font-black text-ink">Nội dung</span>
            <textarea
              rows={5}
              placeholder="Mô tả môn thể thao, cự ly, lịch tập hoặc sản phẩm bạn quan tâm"
              className="rounded border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-red"
            />
          </label>
          <button
            type="button"
            className="h-12 rounded bg-brand-red px-5 text-sm font-black text-white hover:bg-red-700"
          >
            Gửi thông tin
          </button>
        </div>
      </form>
    </section>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded border border-line p-4">
      <Icon className="h-5 w-5 text-brand-red" />
      <div>
        <p className="text-xs font-black uppercase text-muted">{label}</p>
        <p className="font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-ink">{label}</span>
      <input
        placeholder={placeholder}
        className="h-12 rounded border border-line bg-white px-4 text-sm outline-none focus:border-brand-red"
      />
    </label>
  );
}
