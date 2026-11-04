"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { formatPrice } from "@/components/price-display";
import { useCart } from "@/context/cart-context";

export function MiniCartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalItems,
    totalAmount,
    isHydrated,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeCart();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 animate-in slide-in-from-right"
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng của bạn"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-red" />
            <h2 className="text-lg font-black uppercase text-ink">
              Giỏ hàng{" "}
              {isHydrated && totalItems > 0 ? (
                <span className="text-sm font-bold text-muted">({totalItems})</span>
              ) : null}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded border border-line text-muted transition hover:border-ink hover:text-ink"
            aria-label="Đóng giỏ hàng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!isHydrated || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface text-slate-400">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h3 className="mt-5 text-lg font-black text-ink">
              Giỏ hàng của bạn đang trống
            </h3>
            <p className="mt-2 text-sm text-muted">
              Hãy chọn những sản phẩm dinh dưỡng thể thao chất lượng cao để nạp năng lượng ngay hôm nay!
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded bg-brand-red px-6 text-sm font-black uppercase text-white shadow transition hover:bg-red-700"
            >
              Khám phá sản phẩm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto divide-y divide-line p-5">
              {items.map((item) => {
                const title = typeof item.name === "string" ? item.name : item.name.vi;
                return (
                  <article key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-line bg-surface">
                      {item.imagePath ? (
                        <Image
                          src={item.imagePath}
                          alt={title}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="line-clamp-2 text-sm font-bold text-ink transition hover:text-brand-red"
                          >
                            {title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 transition hover:text-red-600"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Variants badge */}
                        {(item.flavor || item.size) && (
                          <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted">
                            {item.flavor && (
                              <span className="rounded bg-surface px-1.5 py-0.5 font-medium">
                                Vị: {item.flavor}
                              </span>
                            )}
                            {item.size && (
                              <span className="rounded bg-surface px-1.5 py-0.5 font-medium">
                                Quy cách: {item.size}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Price & Quantity */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-black text-brand-red">
                          {formatPrice(item.price)}
                        </span>

                        <div className="flex items-center rounded border border-line">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-ink transition hover:bg-surface"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-ink transition hover:bg-surface"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-line bg-surface/50 p-5">
              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-muted">Tạm tính:</span>
                <span className="text-xl font-black text-brand-red">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                * Chưa bao gồm phí vận chuyển (nếu có). Nhân viên CSKH sẽ tư vấn chi tiết khi gọi xác nhận đơn.
              </p>

              <div className="mt-4 grid gap-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded bg-brand-red text-sm font-black uppercase text-white shadow-sm transition hover:bg-red-700"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Tiến hành Đặt hàng
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  className="flex h-11 w-full items-center justify-center rounded border border-line bg-white text-sm font-bold text-ink transition hover:bg-surface"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

