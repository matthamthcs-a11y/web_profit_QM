"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
};

export function AdminSubmitButton({
  label,
  pendingLabel,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();
  const visibleLabel = pending ? pendingLabel ?? getPendingLabel(label) : label;

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex h-10 items-center justify-center gap-2 rounded bg-brand-red px-4 text-sm font-black uppercase text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-80"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {visibleLabel}
    </button>
  );
}

function getPendingLabel(label: string) {
  const normalized = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (normalized === "save") return "Saving...";
  if (normalized.includes("cap nhat") || normalized.includes("update")) {
    return "Đang cập nhật...";
  }
  if (normalized.includes("xoa") || normalized.includes("delete")) {
    return "Đang xóa...";
  }

  return "Đang lưu...";
}
