"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { createOrderAction } from "@/app/actions/order";
import { formatPrice } from "@/components/price-display";
import { useCart } from "@/context/cart-context";

export function CartView() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalAmount,
    isHydrated,
  } = useCart();

  // Checkout Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [provinceCity, setProvinceCity] = useState("");
  const [district, setDistrict] = useState("");
  const [paymentPreference, setPaymentPreference] = useState<
    "cod" | "bank_transfer"
  >("cod");
  const [customerNotes, setCustomerNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isHydrated) {
    return (
      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-px mx-auto max-w-4xl py-20 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-surface text-slate-400">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h1 className="mt-6 text-2xl font-black uppercase text-ink md:text-3xl">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
          Bạn chưa chọn sản phẩm nào. Hãy khám phá ngay các dòng sản phẩm dinh dưỡng thể thao cao cấp chính hãng từ Pro-Fitness & Hammer Nutrition!
        </p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded bg-brand-red px-8 text-sm font-black uppercase text-white shadow-md transition hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Khám phá danh mục sản phẩm
          </Link>
        </div>
      </section>
    );
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage("Vui lòng nhập số điện thoại người nhận.");
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ giao hàng chi tiết.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        productName: typeof item.name === "string" ? item.name : item.name.vi,
        variantLabel: [item.flavor, item.size].filter(Boolean).join(" - ") || null,
        price: item.price,
        quantity: item.quantity,
        imagePath: item.imagePath,
      }));

      const res = await createOrderAction({
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        provinceCity,
        district,
        paymentPreference,
        customerNotes,
        items: orderItems,
        sourceDomain: "profitness",
      });

      if (!res.success) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      // Success
      clearCart();
      router.push(`/cart/success?code=${encodeURIComponent(res.orderCode)}`);
    } catch (err) {
      console.error("Submit order error:", err);
      setErrorMessage("Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-px mx-auto max-w-7xl py-10 md:py-14">
      {/* Breadcrumb / Title */}
      <div className="border-b border-line pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tight text-ink md:text-4xl">
          Giỏ hàng & Đặt mua
        </h1>
        <p className="mt-2 text-sm text-muted">
          Kiểm tra các món hàng của bạn và điền thông tin để nhân viên liên hệ tư vấn xác nhận.
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Left Column: Cart Items List */}
        <div>
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-lg font-black uppercase text-ink">
              Sản phẩm trong giỏ ({totalItems})
            </h2>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-muted underline hover:text-red-600"
            >
              Xóa toàn bộ
            </button>
          </div>

          <div className="divide-y divide-line rounded border border-line bg-white">
            {items.map((item) => {
              const title = typeof item.name === "string" ? item.name : item.name.vi;
              const lineTotal = item.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
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
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bold text-ink transition hover:text-brand-red"
                      >
                        {title}
                      </Link>
                      {(item.flavor || item.size) && (
                        <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted">
                          {item.flavor && (
                            <span className="rounded bg-surface px-2 py-0.5 font-medium">
                              Vị: {item.flavor}
                            </span>
                          )}
                          {item.size && (
                            <span className="rounded bg-surface px-2 py-0.5 font-medium">
                              Quy cách: {item.size}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="mt-1 text-sm font-semibold text-muted">
                        Đơn giá: {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <div className="flex items-center rounded border border-line">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink transition hover:bg-surface"
                        aria-label="Giảm"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink transition hover:bg-surface"
                        aria-label="Tăng"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-brand-red">
                        {formatPrice(lineTotal)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 transition hover:text-red-600"
                      title="Xóa món"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-ink hover:text-brand-red"
            >
              <ArrowLeft className="h-4 w-4" />
              Chọn thêm sản phẩm khác
            </Link>
          </div>

          {/* Guarantees */}
          <div className="mt-8 grid grid-cols-1 gap-4 rounded border border-line bg-surface/60 p-5 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-red" />
              <div>
                <h4 className="text-xs font-black uppercase text-ink">100% Chính Hãng</h4>
                <p className="text-xs text-muted">Nhập khẩu chính ngạch USA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-brand-red" />
              <div>
                <h4 className="text-xs font-black uppercase text-ink">Giao Hàng Toàn Quốc</h4>
                <p className="text-xs text-muted">Đóng gói chuẩn bảo quản</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-brand-red" />
              <div>
                <h4 className="text-xs font-black uppercase text-ink">Tư Vấn Chuyên Sâu</h4>
                <p className="text-xs text-muted">Đội ngũ VĐV & chuyên gia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div>
          <div className="rounded border border-line bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-black uppercase text-ink">
              Thông tin nhận hàng
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              Quý khách không cần thanh toán ngay. Nhân viên sẽ liên hệ qua điện thoại để xác nhận đơn hàng và tư vấn trước khi gửi hàng.
            </p>

            {errorMessage && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-ink">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded border border-line px-3.5 text-sm font-medium text-ink focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912 345 678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded border border-line px-3.5 text-sm font-medium text-ink focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink">
                  Email <span className="text-xs font-normal text-muted">(Không bắt buộc)</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded border border-line px-3.5 text-sm font-medium text-ink focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink">
                    Tỉnh / Thành phố
                  </label>
                  <input
                    type="text"
                    placeholder="Hồ Chí Minh, Hà Nội..."
                    value={provinceCity}
                    onChange={(e) => setProvinceCity(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded border border-line px-3.5 text-sm font-medium text-ink focus:border-brand-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-ink">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    placeholder="Quận 1, Cầu Giấy..."
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded border border-line px-3.5 text-sm font-medium text-ink focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink">
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, phường/xã"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded border border-line px-3.5 text-sm font-medium text-ink focus:border-brand-red focus:outline-none"
                />
              </div>

              {/* Payment Preference */}
              <div>
                <label className="block text-xs font-bold uppercase text-ink">
                  Hình thức thanh toán mong muốn
                </label>
                <div className="mt-2 space-y-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded border border-line p-3 hover:bg-surface">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentPreference === "cod"}
                      onChange={() => setPaymentPreference("cod")}
                      className="mt-1 text-brand-red"
                    />
                    <div>
                      <p className="text-sm font-bold text-ink">
                        Thanh toán khi nhận hàng (COD)
                      </p>
                      <p className="text-xs text-muted">
                        Khách hàng kiểm tra hàng và thanh toán tiền mặt cho nhân viên giao hàng.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded border border-line p-3 hover:bg-surface">
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentPreference === "bank_transfer"}
                      onChange={() => setPaymentPreference("bank_transfer")}
                      className="mt-1 text-brand-red"
                    />
                    <div>
                      <p className="text-sm font-bold text-ink">
                        Chuyển khoản ngân hàng
                      </p>
                      <p className="text-xs text-muted">
                        Nhân viên sẽ cung cấp số tài khoản chính thức khi gọi điện xác nhận đơn.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink">
                  Ghi chú đơn hàng / Lời nhắn tư vấn
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Giao giờ hành chính, cần tư vấn thêm cách dùng chạy marathon 42km..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="mt-1.5 w-full rounded border border-line p-3 text-sm font-medium text-ink focus:border-brand-red focus:outline-none"
                />
              </div>

              {/* Order summary */}
              <div className="border-t border-line pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tạm tính:</span>
                  <span className="font-bold text-ink">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Phí vận chuyển:</span>
                  <span className="font-semibold text-brand-green">
                    {totalAmount >= 2000000 ? "Miễn phí" : "Tư vấn khi gọi xác nhận"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-lg">
                  <span className="font-black text-ink">Tổng thanh toán:</span>
                  <span className="font-black text-brand-red">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded bg-brand-red text-base font-black uppercase text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang tạo đơn hàng...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Xác nhận đặt hàng
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

