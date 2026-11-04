import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Phone, ShoppingBag } from "lucide-react";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  description: "Cảm ơn bạn đã đặt hàng tại Pro-Fitness & Hammer Nutrition.",
};

type SuccessPageProps = {
  searchParams: Promise<{
    code?: string;
  }>;
};

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { code } = await searchParams;
  const siteSettings = await getSiteSettings();

  return (
    <div className="container-px mx-auto max-w-3xl py-16 md:py-24">
      <div className="rounded border border-line bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-12 w-12" />
        </div>

        <h1 className="mt-6 text-2xl font-black uppercase text-ink md:text-3xl">
          Đặt hàng thành công!
        </h1>

        <p className="mt-2 text-sm text-muted">
          Cảm ơn bạn đã tin tưởng sản phẩm dinh dưỡng thể thao chính hãng của chúng tôi.
        </p>

        {code && (
          <div className="mx-auto mt-6 inline-flex flex-col items-center justify-center rounded-lg border border-line bg-surface px-6 py-3">
            <span className="text-xs font-bold uppercase text-muted">
              Mã đơn hàng của bạn
            </span>
            <span className="mt-1 text-xl font-black tracking-wider text-brand-red">
              #{code}
            </span>
          </div>
        )}

        <div className="mx-auto mt-8 max-w-lg rounded-lg border border-emerald-100 bg-emerald-50/60 p-5 text-left text-sm leading-relaxed text-emerald-900">
          <p className="font-bold">
            Quy trình tiếp theo:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs sm:text-sm">
            <li>
              Hệ thống đã ghi nhận đơn hàng và chuyển đến bộ phận CSKH.
            </li>
            <li>
              Chuyên viên tư vấn sẽ liên hệ với bạn trong vòng <strong>15 - 30 phút</strong> để xác nhận sản phẩm, địa chỉ và hẹn lịch giao hàng.
            </li>
            <li>
              Nếu cần hỗ trợ gấp hoặc thay đổi thông tin, xin vui lòng gọi hotline bên dưới.
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${siteSettings.hotline}`}
            className="inline-flex h-12 items-center gap-2 rounded bg-ink px-6 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Phone className="h-4 w-4" />
            Hotline: {siteSettings.hotline}
          </a>
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded bg-brand-red px-6 text-sm font-black uppercase text-white shadow transition hover:bg-red-700"
          >
            <ShoppingBag className="h-4 w-4" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

