"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function CartHeaderButton() {
  const { totalItems, openCart, isHydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex h-10 w-10 items-center justify-center rounded border border-line text-ink transition hover:border-brand-red hover:text-brand-red"
      aria-label="Mở giỏ hàng"
      title="Giỏ hàng"
    >
      <ShoppingBag className="h-5 w-5" />
      {isHydrated && totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[11px] font-black text-white shadow-sm">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

