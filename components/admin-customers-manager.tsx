"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteCustomer, saveCustomer } from "@/app/admin/actions";
import { AdminDeleteButton, AdminSubmit } from "@/components/admin-fields";
import { formatPrice } from "@/components/price-display";
import type {
  AdminCustomerOrderSummary,
  AdminCustomerPageRow,
  AdminCustomersPageResult,
} from "@/lib/admin/data";

const PAGE_SIZE = 25;

const orderStatusLabels: Record<string, { label: string; cls: string }> = {
  new: { label: "Đơn mới", cls: "bg-red-50 text-red-700 border-red-200" },
  contacted: {
    label: "Đã liên hệ",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
  confirmed: {
    label: "Đã chốt đơn",
    cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  shipping: {
    label: "Đang giao",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Hoàn tất",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Đã hủy",
    cls: "bg-slate-100 text-slate-600 border-slate-300",
  },
};

export function AdminCustomersManager({
  initialData,
}: {
  initialData: AdminCustomersPageResult;
}) {
  const [data, setData] = useState<AdminCustomersPageResult>(initialData);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [activeCustomer, setActiveCustomer] =
    useState<AdminCustomerPageRow | null>(null);
  const [customerOrders, setCustomerOrders] = useState<
    AdminCustomerOrderSummary[]
  >([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isFirstRender = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 280);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const fetchCustomersPage = useCallback(
    async (params: {
      q: string;
      source: string;
      segment: string;
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
          source: params.source,
          segment: params.segment,
        });
        if (params.q) sp.set("q", params.q);

        const res = await fetch(`/api/admin/customers?${sp.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = (await res.json()) as AdminCustomersPageResult;
        setData(json);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to fetch customers page:", err);
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
    fetchCustomersPage({
      q: debouncedSearch,
      source: selectedSource,
      segment: selectedSegment,
      pageNum: page,
    });
  }, [
    debouncedSearch,
    selectedSource,
    selectedSegment,
    page,
    fetchCustomersPage,
  ]);

  const refreshCurrent = useCallback(() => {
    return fetchCustomersPage({
      q: debouncedSearch,
      source: selectedSource,
      segment: selectedSegment,
      pageNum: page,
    });
  }, [
    debouncedSearch,
    selectedSource,
    selectedSegment,
    page,
    fetchCustomersPage,
  ]);

  // Lazy-load order history only when a customer detail modal is opened
  useEffect(() => {
    if (!activeCustomer) {
      setCustomerOrders([]);
      return;
    }
    let cancelled = false;
    setIsLoadingOrders(true);
    fetch(`/api/admin/customers/${activeCustomer.id}/orders`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((json: { orders?: AdminCustomerOrderSummary[] }) => {
        if (!cancelled) {
          setCustomerOrders(json.orders || []);
        }
      })
      .catch(() => {
        if (!cancelled) setCustomerOrders([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingOrders(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCustomer]);

  const totalPages = Math.max(1, Math.ceil(data.filteredTotal / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  function handleExportExcel() {
    if (data.filteredTotal === 0) {
      alert("Không có khách hàng nào để xuất.");
      return;
    }
    const sp = new URLSearchParams({
      source: selectedSource,
      segment: selectedSegment,
    });
    if (debouncedSearch) sp.set("q", debouncedSearch);
    window.location.href = `/api/admin/customers/export?${sp.toString()}`;
  }

  return (
    <div className="mt-8 space-y-6">
      {/* 1. Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => {
            setSelectedSegment("all");
            setSelectedSource("all");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedSegment === "all" && selectedSource === "all"
              ? "border-ink bg-surface shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-muted">
            Tổng khách hàng
          </span>
          <span className="mt-1 text-2xl font-black text-ink">
            {data.stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedSegment("with_orders");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedSegment === "with_orders"
              ? "border-emerald-500 bg-emerald-50 shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-emerald-700">
            Đã phát sinh đơn
          </span>
          <span className="mt-1 text-2xl font-black text-emerald-700">
            {data.stats.withOrders}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedSegment("repeat");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedSegment === "repeat"
              ? "border-indigo-500 bg-indigo-50 shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-indigo-700">
            Khách quay lại (≥2 đơn)
          </span>
          <span className="mt-1 text-2xl font-black text-indigo-700">
            {data.stats.repeat}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedSource("hammer");
            setSelectedSegment("all");
            setPage(1);
          }}
          className={`flex flex-col rounded-lg border p-4 text-left transition ${
            selectedSource === "hammer"
              ? "border-amber-500 bg-amber-50 shadow-sm"
              : "border-line bg-white hover:bg-surface/50"
          }`}
        >
          <span className="text-xs font-bold uppercase text-amber-800">
            Nguồn Hammer / Pro-Fitness
          </span>
          <span className="mt-1 text-2xl font-black text-amber-800">
            {data.stats.hammer} / {data.stats.profitness}
          </span>
        </button>
      </div>

      {/* 2. Search, Filter & Actions */}
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          {isLoading ? (
            <Loader2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-brand-red" />
          ) : (
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          )}
          <input
            type="text"
            placeholder="Tìm theo họ tên, số điện thoại, email hoặc địa chỉ..."
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
            value={selectedSegment}
            onChange={(e) => {
              setSelectedSegment(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded border border-line bg-white px-3 text-sm font-bold text-ink focus:outline-none"
          >
            <option value="all">Tất cả phân khúc</option>
            <option value="with_orders">Đã có đơn hàng</option>
            <option value="repeat">Khách mua ≥ 2 đơn</option>
            <option value="no_orders">Chưa phát sinh đơn</option>
          </select>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-10 items-center gap-1.5 rounded bg-brand-red px-4 text-xs font-black uppercase text-white shadow-sm transition hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            Thêm khách
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex h-10 items-center gap-2 rounded bg-emerald-700 px-4 text-xs font-black uppercase text-white shadow-sm transition hover:bg-emerald-800"
            title="Xuất file Excel danh sách khách hàng"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">
              Xuất Excel ({data.filteredTotal})
            </span>
          </button>
        </div>
      </div>

      {/* 3. Customers Table */}
      {data.customers.length === 0 ? (
        <div className="rounded-lg border border-line bg-white p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-ink">
            Không tìm thấy khách hàng nào
          </h3>
          <p className="mt-1 text-sm text-muted">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
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
                  <th className="px-4 py-3.5">Khách hàng</th>
                  <th className="px-4 py-3.5">Liên hệ</th>
                  <th className="px-4 py-3.5">Địa chỉ</th>
                  <th className="px-4 py-3.5">Đơn hàng & Chi tiêu</th>
                  <th className="px-4 py-3.5">Ngày tạo</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-medium text-ink">
                {data.customers.map((customer) => {
                  const isHammer = (customer.source_domain || "")
                    .toLowerCase()
                    .includes("hammer");

                  return (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-surface/40"
                    >
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => setActiveCustomer(customer)}
                          className="text-left font-bold text-ink hover:text-brand-red hover:underline"
                        >
                          {customer.full_name}
                        </button>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${
                              isHammer
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {isHammer ? "Hammer" : "Pro-Fitness"}
                          </span>
                          {customer.notes && (
                            <span
                              className="line-clamp-1 max-w-[160px] text-[11px] text-muted"
                              title={customer.notes}
                            >
                              • {customer.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                            <Phone className="h-3.5 w-3.5 text-muted" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        {customer.email && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                            <Mail className="h-3.5 w-3.5" />
                            <span
                              className="max-w-[210px] truncate"
                              title={customer.email}
                            >
                              {customer.email}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="max-w-[260px] px-4 py-3.5">
                        {customer.address ? (
                          <div
                            className="line-clamp-2 text-xs text-slate-700"
                            title={customer.address}
                          >
                            {customer.address}
                          </div>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => setActiveCustomer(customer)}
                          className="flex items-center gap-1.5 text-xs font-bold text-ink hover:text-brand-red"
                        >
                          <ShoppingBag className="h-3.5 w-3.5 text-muted" />
                          <span>{customer.order_count} đơn</span>
                        </button>
                        {Number(customer.total_spent) > 0 && (
                          <div className="mt-0.5 text-xs font-black text-brand-red">
                            {formatPrice(Number(customer.total_spent))}
                          </div>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted">
                        {new Date(customer.created_at).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {customer.phone && (
                            <>
                              <a
                                href={`tel:${customer.phone}`}
                                className="flex h-8 w-8 items-center justify-center rounded border border-line text-emerald-600 transition hover:bg-emerald-50"
                                title="Gọi điện"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                              <a
                                href={`https://zalo.me/${customer.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded border border-line text-blue-600 transition hover:bg-blue-50"
                                title="Mở chat Zalo"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </a>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => setActiveCustomer(customer)}
                            className="flex h-8 w-8 items-center justify-center rounded border border-line text-ink transition hover:bg-surface"
                            title="Xem chi tiết & sửa"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <form
                            action={async (fd) => {
                              await deleteCustomer(fd);
                              await refreshCurrent();
                            }}
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={customer.id}
                            />
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

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-line bg-surface/40 px-4 py-3 text-xs font-bold text-muted sm:flex-row">
            <span>
              Hiển thị {(safePage - 1) * PAGE_SIZE + 1} –{" "}
              {Math.min(safePage * PAGE_SIZE, data.filteredTotal)} trên tổng{" "}
              {data.filteredTotal} khách hàng
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

      {/* 4. Customer Detail & Edit Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setActiveCustomer(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl border border-line bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <h3 className="text-xl font-black text-ink">
                  {activeCustomer.full_name}
                </h3>
                <p className="text-xs text-muted">
                  Khởi tạo:{" "}
                  {new Date(activeCustomer.created_at).toLocaleString("vi-VN")}{" "}
                  • {activeCustomer.order_count} đơn hàng • Tổng chi tiêu:{" "}
                  <strong className="text-brand-red">
                    {formatPrice(Number(activeCustomer.total_spent))}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCustomer(null)}
                className="flex h-9 w-9 items-center justify-center rounded border border-line text-muted hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <form
                action={async (fd) => {
                  await saveCustomer(fd);
                  await refreshCurrent();
                  setActiveCustomer(null);
                }}
                className="space-y-4"
              >
                <input type="hidden" name="id" value={activeCustomer.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-black uppercase text-muted">
                      Họ và tên *
                    </label>
                    <input
                      name="full_name"
                      required
                      defaultValue={activeCustomer.full_name}
                      className="mt-1 h-10 w-full rounded border border-line px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-muted">
                      Số điện thoại
                    </label>
                    <input
                      name="phone"
                      defaultValue={activeCustomer.phone || ""}
                      className="mt-1 h-10 w-full rounded border border-line px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-muted">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={activeCustomer.email || ""}
                      className="mt-1 h-10 w-full rounded border border-line px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-muted">
                      Nguồn khách hàng
                    </label>
                    <select
                      name="source_domain"
                      defaultValue={
                        (activeCustomer.source_domain || "")
                          .toLowerCase()
                          .includes("hammer")
                          ? "hammer"
                          : "profitness"
                      }
                      className="mt-1 h-10 w-full rounded border border-line bg-white px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                    >
                      <option value="hammer">Hammer Nutrition</option>
                      <option value="profitness">Pro-Fitness</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-black uppercase text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    Địa chỉ
                  </label>
                  <input
                    name="address"
                    defaultValue={activeCustomer.address || ""}
                    className="mt-1 h-10 w-full rounded border border-line px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-muted">
                    Ghi chú CSKH (Nội bộ)
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    defaultValue={activeCustomer.notes || ""}
                    placeholder="Sở thích hương vị, nhóm chạy bộ, lưu ý giao hàng..."
                    className="mt-1 w-full rounded border border-line p-3 text-sm font-medium text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <AdminSubmit label="Lưu thông tin khách hàng" />
                </div>
              </form>

              <div className="border-t border-line pt-5">
                <h4 className="text-xs font-black uppercase text-ink">
                  Lịch sử đơn hàng ({activeCustomer.order_count})
                </h4>
                {isLoadingOrders ? (
                  <div className="mt-3 flex items-center justify-center gap-2 rounded border border-line p-6 text-xs font-bold text-muted">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-red" />
                    Đang tải lịch sử đơn hàng...
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="mt-2 rounded border border-dashed border-line p-4 text-center text-xs text-muted">
                    Chưa có đơn hàng nào khớp với SĐT/Email của khách hàng này.
                  </p>
                ) : (
                  <div className="mt-2 divide-y divide-line rounded border border-line">
                    {customerOrders.map((order) => {
                      const st = orderStatusLabels[order.status] || {
                        label: order.status,
                        cls: "bg-surface text-muted border-line",
                      };
                      return (
                        <div
                          key={order.id}
                          className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"
                        >
                          <div>
                            <span className="font-black text-brand-red">
                              #{order.order_code}
                            </span>
                            <span className="ml-2 text-xs text-muted">
                              {new Date(order.created_at).toLocaleString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded border px-2 py-0.5 text-[11px] font-bold ${st.cls}`}
                            >
                              {st.label}
                            </span>
                            <span className="font-black text-ink">
                              {formatPrice(Number(order.total_amount))}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line bg-surface/50 px-6 py-3.5">
              <div className="flex items-center gap-2">
                {activeCustomer.phone && (
                  <>
                    <a
                      href={`tel:${activeCustomer.phone}`}
                      className="inline-flex h-10 items-center gap-1.5 rounded bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Phone className="h-4 w-4" />
                      Gọi điện
                    </a>
                    <a
                      href={`https://zalo.me/${activeCustomer.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 rounded bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat Zalo
                    </a>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveCustomer(null)}
                className="h-10 rounded border border-line bg-white px-5 text-sm font-bold text-ink hover:bg-surface"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-line bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-lg font-black uppercase text-ink">
                Thêm khách hàng mới
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded border border-line text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              action={async (fd) => {
                await saveCustomer(fd);
                setShowCreateModal(false);
                await refreshCurrent();
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-black uppercase text-muted">
                  Họ và tên *
                </label>
                <input
                  name="full_name"
                  required
                  placeholder="Nguyễn Văn A"
                  className="mt-1 h-10 w-full rounded border border-line px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-black uppercase text-muted">
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    placeholder="0901234567"
                    className="mt-1 h-10 w-full rounded border border-line px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-muted">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    className="mt-1 h-10 w-full rounded border border-line px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-muted">
                  Địa chỉ
                </label>
                <input
                  name="address"
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."
                  className="mt-1 h-10 w-full rounded border border-line px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-muted">
                  Nguồn
                </label>
                <select
                  name="source_domain"
                  defaultValue="hammer"
                  className="mt-1 h-10 w-full rounded border border-line bg-white px-3 text-sm font-semibold text-ink focus:border-ink focus:outline-none"
                >
                  <option value="hammer">Hammer Nutrition</option>
                  <option value="profitness">Pro-Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-muted">
                  Ghi chú CSKH
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Ghi chú nội bộ..."
                  className="mt-1 w-full rounded border border-line p-3 text-sm font-medium text-ink focus:border-ink focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-10 rounded border border-line px-4 text-sm font-bold text-ink hover:bg-surface"
                >
                  Hủy
                </button>
                <AdminSubmit label="Thêm khách hàng" />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
