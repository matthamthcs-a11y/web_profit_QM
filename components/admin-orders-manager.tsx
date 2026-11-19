"use client";

import Image from "next/image";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileSpreadsheet,
  Loader2,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteOrder,
  updateOrderStaffNotes,
  updateOrderStatus,
} from "@/app/admin/actions";
import { AdminDeleteButton, AdminSubmit } from "@/components/admin-fields";
import { formatPrice } from "@/components/price-display";
import type {
  AdminOrderRow,
  AdminOrdersPageResult,
} from "@/lib/admin/data";

const PAGE_SIZE = 25;

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: typeof Clock }
> = {
  new: {
    label: "Đơn mới (Chưa gọi)",
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    icon: Clock,
  },
  contacted: {
    label: "Đã liên hệ",
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: Phone,
  },
  confirmed: {
    label: "Đã chốt đơn",
    bg: "bg-indigo-50 border-indigo-200",
    text: "text-indigo-700",
    icon: CheckCircle2,
  },
  shipping: {
    label: "Đang giao hàng",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: Truck,
  },
  completed: {
    label: "Hoàn tất",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-slate-100 border-slate-300",
    text: "text-slate-600",
    icon: XCircle,
  },
};

export function AdminOrdersManager({
  initialData,
}: {
  initialData: AdminOrdersPageResult;
}) {
  const [data, setData] = useState<AdminOrdersPageResult>(initialData);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDetailOrder, setActiveDetailOrder] =
    useState<AdminOrderRow | null>(null);

  const isFirstRender = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  // Sync when Next.js revalidates initialData
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Debounce search input
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 280);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const fetchOrdersPage = useCallback(
    async (params: {
      q: string;
      status: string;
      source: string;
      pageNum: number;
    }) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);

      try {
        const sp = new URLSearchParams({
          page: String(params.pageNum),
          limit: String(PAGE_SIZE),
          status: params.status,
          source: params.source,
        });
        if (params.q) sp.set("q", params.q);

        const res = await fetch(`/api/admin/orders?${sp.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = (await res.json()) as AdminOrdersPageResult;
        setData(json);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to fetch orders page:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchOrdersPage({
      q: debouncedSearch,
      status: selectedStatus,
      source: selectedSource,
      pageNum: page,
    });
  }, [debouncedSearch, selectedStatus, selectedSource, page, fetchOrdersPage]);

  const refreshCurrent = useCallback(() => {
    return fetchOrdersPage({
      q: debouncedSearch,
      status: selectedStatus,
      source: selectedSource,
      pageNum: page,
    });
  }, [debouncedSearch, selectedStatus, selectedSource, page, fetchOrdersPage]);

  const totalPages = Math.max(1, Math.ceil(data.filteredTotal / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  function handleExportExcel() {
    if (data.filteredTotal === 0) {
      alert("Không có đơn hàng nào để xuất.");
      return;
    }
    const sp = new URLSearchParams({
      status: selectedStatus,
      source: selectedSource,
    });
    if (debouncedSearch) sp.set("q", debouncedSearch);
    window.location.href = `/api/admin/orders/export?${sp.toString()}`;
  }

  return (
    <div className="mt-8 space-y-6">
      {/* 1. Quick Stats Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <button
          type="button"
          onClick={() => {
            setSelectedStatus("all");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedStatus === "all"
              ? "border-ink bg-surface shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-muted">
            Tất cả đơn
          </span>
          <span className="mt-1 text-2xl font-black text-ink">
            {data.stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedStatus("new");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedStatus === "new"
              ? "border-red-500 bg-red-50 shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-red-600">
            Cần gọi ngay
          </span>
          <span className="mt-1 text-2xl font-black text-red-600">
            {data.stats.new}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedStatus("processing");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedStatus === "processing"
              ? "border-indigo-500 bg-indigo-50 shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-indigo-600">
            Đang xử lý
          </span>
          <span className="mt-1 text-2xl font-black text-indigo-600">
            {data.stats.processing}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedStatus("completed");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedStatus === "completed"
              ? "border-emerald-500 bg-emerald-50 shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-emerald-600">
            Hoàn tất
          </span>
          <span className="mt-1 text-2xl font-black text-emerald-600">
            {data.stats.completed}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedStatus("cancelled");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedStatus === "cancelled"
              ? "border-slate-500 bg-slate-100 shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-slate-500">
            Đã hủy
          </span>
          <span className="mt-1 text-2xl font-black text-slate-500">
            {data.stats.cancelled}
          </span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          {isLoading ? (
            <Loader2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-brand-red" />
          ) : (
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          )}
          <input
            type="text"
            placeholder="Tìm theo mã đơn, họ tên, số điện thoại, email hoặc địa chỉ..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded border border-line pl-10 pr-9 text-sm font-medium text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded border border-line bg-white px-3 text-sm font-bold text-ink focus:outline-none"
          >
            <option value="all">Tất cả nguồn</option>
            <option value="hammer">Hammer Nutrition</option>
            <option value="profitness">Pro-Fitness</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded border border-line bg-white px-3 text-sm font-bold text-ink focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Đơn mới (Chưa gọi)</option>
            <option value="processing">Đang xử lý</option>
            <option value="contacted">Đã liên hệ</option>
            <option value="confirmed">Đã chốt đơn</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="completed">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex h-10 items-center gap-2 rounded bg-emerald-700 px-4 text-xs font-black uppercase text-white shadow-sm transition hover:bg-emerald-800"
            title="Xuất file Excel danh sách đơn hàng"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">
              Xuất Excel ({data.filteredTotal})
            </span>
          </button>
        </div>
      </div>

      {/* 3. Orders List Table */}
      {data.orders.length === 0 ? (
        <div className="rounded-lg border border-line bg-white p-12 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-ink">
            Không tìm thấy đơn hàng nào
          </h3>
          <p className="mt-1 text-sm text-muted">
            {searchInput || selectedStatus !== "all" || selectedSource !== "all"
              ? "Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc."
              : "Chưa có đơn hàng nào trong hệ thống."}
          </p>
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-lg border border-line bg-white shadow-sm transition-opacity ${
            isLoading ? "opacity-60" : "opacity-100"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface/70 text-xs font-black uppercase text-muted">
                <tr>
                  <th className="px-4 py-3.5">Mã đơn</th>
                  <th className="px-4 py-3.5">Thời gian</th>
                  <th className="px-4 py-3.5">Khách hàng & SĐT</th>
                  <th className="px-4 py-3.5">Món hàng</th>
                  <th className="px-4 py-3.5">Tổng tiền</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-medium text-ink">
                {data.orders.map((order) => {
                  const cfg = statusConfig[order.status] || {
                    label: order.status,
                    bg: "bg-surface border-line",
                    text: "text-muted",
                  };
                  const itemCount = (order.order_items || []).reduce(
                    (s, i) => s + i.quantity,
                    0,
                  );
                  const isHammer = (order.source_domain || "")
                    .toLowerCase()
                    .includes("hammer");

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-surface/40"
                    >
                      {/* Code */}
                      <td className="px-4 py-3.5 font-bold">
                        <button
                          type="button"
                          onClick={() => setActiveDetailOrder(order)}
                          className="font-black text-brand-red hover:underline"
                        >
                          #{order.order_code}
                        </button>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-muted">
                          <span>
                            {order.payment_preference === "bank_transfer"
                              ? "Chuyển khoản"
                              : "COD"}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${
                              isHammer
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {isHammer ? "Hammer" : "Pro-Fitness"}
                          </span>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted">
                        {new Date(order.created_at).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-ink">
                          {order.customer_name}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <span>{order.customer_phone}</span>
                        </div>
                        <div
                          className="line-clamp-1 text-xs text-muted"
                          title={order.shipping_address}
                        >
                          {order.shipping_address}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => setActiveDetailOrder(order)}
                          className="flex items-center gap-1.5 text-xs font-bold text-ink hover:text-brand-red"
                        >
                          <Package className="h-4 w-4 text-muted" />
                          <span>{itemCount} món</span>
                          <Eye className="h-3.5 w-3.5 text-muted" />
                        </button>
                        <div className="line-clamp-1 text-xs text-muted">
                          {(order.order_items || [])
                            .map((i) => i.product_name)
                            .slice(0, 2)
                            .join(", ")}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="whitespace-nowrap px-4 py-3.5 font-black text-brand-red">
                        {formatPrice(order.total_amount)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-4 py-3.5">
                        <form
                          action={async (fd) => {
                            await updateOrderStatus(fd);
                            await refreshCurrent();
                          }}
                          className="inline-block"
                        >
                          <input type="hidden" name="id" value={order.id} />
                          <select
                            name="status"
                            value={order.status}
                            onChange={(e) => e.target.form?.requestSubmit()}
                            className={`h-8 rounded border px-2.5 text-xs font-bold focus:outline-none ${cfg.bg} ${cfg.text}`}
                          >
                            <option value="new">🔴 Đơn mới</option>
                            <option value="contacted">🔵 Đã liên hệ</option>
                            <option value="confirmed">🟣 Đã chốt đơn</option>
                            <option value="shipping">🟡 Đang giao</option>
                            <option value="completed">🟢 Hoàn tất</option>
                            <option value="cancelled">⚪ Đã hủy</option>
                          </select>
                        </form>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${order.customer_phone}`}
                            className="flex h-8 w-8 items-center justify-center rounded border border-line text-emerald-600 transition hover:bg-emerald-50"
                            title="Gọi điện cho khách"
                          >
                            <Phone className="h-4 w-4" />
                          </a>

                          <a
                            href={`https://zalo.me/${order.customer_phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded border border-line text-blue-600 transition hover:bg-blue-50"
                            title="Mở chat Zalo với khách"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setActiveDetailOrder(order)}
                            className="flex h-8 w-8 items-center justify-center rounded border border-line text-ink transition hover:bg-surface"
                            title="Xem chi tiết đơn"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <form
                            action={async (fd) => {
                              await deleteOrder(fd);
                              await refreshCurrent();
                            }}
                          >
                            <input type="hidden" name="id" value={order.id} />
                            <AdminDeleteButton />
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-line bg-surface/40 px-4 py-3 text-xs font-bold text-muted sm:flex-row">
            <span>
              Hiển thị {(safePage - 1) * PAGE_SIZE + 1} –{" "}
              {Math.min(safePage * PAGE_SIZE, data.filteredTotal)} trên tổng{" "}
              {data.filteredTotal} đơn hàng
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1 || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex h-8 items-center gap-1 rounded border border-line bg-white px-2.5 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </button>
                <span className="px-2 text-ink">
                  Trang {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages || isLoading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex h-8 items-center gap-1 rounded border border-line bg-white px-2.5 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Order Detail Modal */}
      {activeDetailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setActiveDetailOrder(null)}
            aria-hidden="true"
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl border border-line bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <h3 className="text-xl font-black uppercase text-ink">
                  Đơn hàng #{activeDetailOrder.order_code}
                </h3>
                <span className="text-xs text-muted">
                  Đặt lúc:{" "}
                  {new Date(activeDetailOrder.created_at).toLocaleString("vi-VN")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded border border-line text-muted hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 rounded-lg border border-line bg-surface/50 p-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-black uppercase text-muted">
                    Người nhận hàng
                  </h4>
                  <p className="mt-1 font-bold text-ink">
                    {activeDetailOrder.customer_name}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    SĐT:{" "}
                    <a
                      href={`tel:${activeDetailOrder.customer_phone}`}
                      className="font-bold text-brand-red hover:underline"
                    >
                      {activeDetailOrder.customer_phone}
                    </a>
                  </p>
                  {activeDetailOrder.customer_email && (
                    <p className="text-sm text-muted">
                      Email: {activeDetailOrder.customer_email}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase text-muted">
                    Địa chỉ giao hàng
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {activeDetailOrder.shipping_address}
                  </p>
                  {(activeDetailOrder.district ||
                    activeDetailOrder.province_city) && (
                    <p className="text-xs text-muted">
                      {[
                        activeDetailOrder.district,
                        activeDetailOrder.province_city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-bold text-ink">
                    Thanh toán:{" "}
                    <span className="text-brand-red">
                      {activeDetailOrder.payment_preference === "bank_transfer"
                        ? "Chuyển khoản ngân hàng"
                        : "Thanh toán khi nhận hàng (COD)"}
                    </span>
                  </p>
                </div>
              </div>

              {activeDetailOrder.customer_notes && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
                  <span className="font-bold">Ghi chú của khách:</span>{" "}
                  {activeDetailOrder.customer_notes}
                </div>
              )}

              <div>
                <h4 className="text-xs font-black uppercase text-ink">
                  Danh sách sản phẩm
                </h4>
                <div className="mt-2 divide-y divide-line rounded border border-line">
                  {(activeDetailOrder.order_items || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-line bg-surface">
                          {item.image_path ? (
                            <Image
                              src={item.image_path}
                              alt={item.product_name}
                              fill
                              className="object-contain p-0.5"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink">
                            {item.product_name}
                          </p>
                          {item.variant_label && (
                            <p className="text-xs text-muted">
                              {item.variant_label}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-ink">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                        <p className="text-xs font-black text-brand-red">
                          = {formatPrice(item.total_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 space-y-1 border-t border-line pt-2 text-sm">
                  {activeDetailOrder.shipping_fee > 0 && (
                    <div className="flex justify-between text-muted">
                      <span>Phí vận chuyển:</span>
                      <span>{formatPrice(activeDetailOrder.shipping_fee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black">
                    <span>Tổng tiền đơn hàng:</span>
                    <span className="text-xl text-brand-red">
                      {formatPrice(activeDetailOrder.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-line bg-surface/50 p-4">
                <h4 className="text-xs font-black uppercase text-ink">
                  Sổ tay ghi chú CSKH (Nội bộ)
                </h4>
                <p className="mt-0.5 text-xs text-muted">
                  Ghi lại lịch sử gọi điện, dặn dò giao hàng, mã vận đơn...
                </p>
                <form
                  action={async (fd) => {
                    await updateOrderStaffNotes(fd);
                    const nextNotes = String(fd.get("staff_notes") || "");
                    setActiveDetailOrder((prev) =>
                      prev ? { ...prev, staff_notes: nextNotes } : null,
                    );
                    await refreshCurrent();
                  }}
                  className="mt-3 space-y-2"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={activeDetailOrder.id}
                  />
                  <textarea
                    name="staff_notes"
                    rows={3}
                    defaultValue={activeDetailOrder.staff_notes || ""}
                    placeholder="Ví dụ: 10:30 - Đã gọi khách chốt đơn, khách đổi vị Cam, gửi Viettel Post mã VT123..."
                    className="w-full rounded border border-line bg-white p-3 text-sm font-medium text-ink focus:border-ink focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <AdminSubmit label="Lưu ghi chú CSKH" />
                  </div>
                </form>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line bg-surface/50 px-6 py-3.5">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeDetailOrder.customer_phone}`}
                  className="inline-flex h-10 items-center gap-1.5 rounded bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <Phone className="h-4 w-4" />
                  Gọi điện
                </a>
                <a
                  href={`https://zalo.me/${activeDetailOrder.customer_phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-1.5 rounded bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat Zalo
                </a>
              </div>

              <button
                type="button"
                onClick={() => setActiveDetailOrder(null)}
                className="h-10 rounded border border-line bg-white px-5 text-sm font-bold text-ink hover:bg-surface"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
