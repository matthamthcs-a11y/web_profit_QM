import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About",
  description: "Gioi thieu Profitness va dinh huong phan phoi san pham.",
};

export default function AboutPage() {
  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow="About"
        title="Profitness"
        description="Trang giới thiệu nên kể rõ vai trò phân phối, tiêu chuẩn chọn sản phẩm, giấy tờ chứng nhận và năng lực tư vấn."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded border border-line p-8">
          <h2 className="text-2xl font-black text-ink">
            Định hướng thương hiệu
          </h2>
          <p className="mt-4 leading-8 text-muted">
            Profitness tập trung vào nhóm sản phẩm dinh dưỡng thể thao chính
            hãng, phục vụ người tập luyện sức bền, gym và các cộng đồng thể thao
            cần tư vấn sử dụng rõ ràng.
          </p>
          <p className="mt-4 leading-8 text-muted">
            Website không ưu tiên bán hàng trực tiếp trong giai đoạn đầu. Vai
            trò chính là trưng bày sản phẩm, tạo niềm tin và dẫn khách hàng đến
            tư vấn hoặc đại lý phù hợp.
          </p>
        </div>
        <div className="rounded bg-surface p-8">
          <h2 className="text-2xl font-black text-ink">Thông tin cần bổ sung</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
            <li>- Câu chuyện thương hiệu Profitness</li>
            <li>- Danh sách thương hiệu chính thức</li>
            <li>- Chứng nhận và giấy tờ nhập khẩu</li>
            <li>- Hình ảnh đội ngũ hoặc văn phòng</li>
            <li>- Chính sách tư vấn và đại lý</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
