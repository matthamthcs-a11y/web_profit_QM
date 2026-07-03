import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { blogPosts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Knowledge",
  description: "Blog va kien thuc dinh duong the thao Profitness.",
};

export default function KnowledgePage() {
  return (
    <section className="container-px mx-auto max-w-7xl py-14">
      <SectionHeading
        eyebrow="Knowledge"
        title="Kiến thức dinh dưỡng thể thao"
        description="Phần nội dung nên được đầu tư để hỗ trợ SEO và giúp khách hàng hiểu cách dùng sản phẩm."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            href={`/knowledge/${post.slug}`}
            key={post.id}
            className="rounded border border-line p-6 hover:border-brand-red hover:shadow-soft"
          >
            <p className="text-xs font-black uppercase text-brand-red">
              {post.category}
            </p>
            <h2 className="mt-3 text-2xl font-black text-ink">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{post.excerpt}</p>
            <p className="mt-5 text-sm font-bold text-ink">
              {post.readingMinutes} phút đọc
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
