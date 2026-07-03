import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug } from "@/lib/mock-data";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container-px mx-auto max-w-3xl py-14">
      <p className="text-sm font-black uppercase tracking-wide text-brand-red">
        {post.category}
      </p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-ink md:text-6xl">
        {post.title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted">{post.excerpt}</p>
      <div className="mt-8 border-y border-line py-4 text-sm font-semibold text-muted">
        {post.publishedAt} · {post.readingMinutes} phút đọc
      </div>
      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          Đây là nội dung mock cho giai đoạn frontend. Ở giai đoạn Supabase,
          phần này sẽ lấy dữ liệu từ bảng blog posts hoặc CMS tùy hướng triển
          khai.
        </p>
        <h2>Ý chính</h2>
        <p>
          Nội dung kiến thức nên giải thích rõ vấn đề, hướng dẫn cách sử dụng
          sản phẩm và gợi ý đối tượng phù hợp. Mỗi bài nên liên kết đến danh mục
          hoặc sản phẩm liên quan.
        </p>
      </div>
    </article>
  );
}
