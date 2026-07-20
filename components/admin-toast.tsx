"use client";

import { useEffect, useState } from "react";

type AdminNotice = {
  type: "success" | "error";
  message: string;
};

const cookieName = "admin_notice";

export function AdminToast({
  initialNotice = null,
}: {
  initialNotice?: AdminNotice | null;
}) {
  const [notice, setNotice] = useState<AdminNotice | null>(initialNotice);

  useEffect(() => {
    setNotice(initialNotice);
  }, [initialNotice]);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${cookieName}=`));

    if (!cookie) {
      return;
    }

    try {
      const rawValue = cookie.slice(cookieName.length + 1);
      setNotice(JSON.parse(decodeURIComponent(rawValue)) as AdminNotice);
    } catch {
      setNotice(null);
    }

    document.cookie = `${cookieName}=; path=/admin; max-age=0`;
  }, []);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeout = window.setTimeout(() => setNotice(null), 5000);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  if (!notice) {
    return null;
  }

  return (
    <div
      className={`fixed right-4 top-4 z-[100] max-w-sm rounded border px-4 py-3 text-sm font-bold shadow-soft ${
        notice.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-brand-red"
      }`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <p className="leading-6">{notice.message}</p>
        <button
          type="button"
          onClick={() => setNotice(null)}
          className="ml-auto text-lg leading-none"
          aria-label="Đóng thông báo"
        >
          x
        </button>
      </div>
    </div>
  );
}
