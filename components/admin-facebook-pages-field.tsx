"use client";

import { useState } from "react";
import { Plus, Trash, ArrowUp, ArrowDown } from "lucide-react";

export function AdminFacebookPagesField({
  defaultValue = [],
}: {
  defaultValue?: { label: string; url: string }[];
}) {
  const [pages, setPages] = useState<{ label: string; url: string }[]>(
    defaultValue.length > 0 ? defaultValue : [{ label: "", url: "" }]
  );

  const addPage = () => {
    setPages([...pages, { label: "", url: "" }]);
  };

  const removePage = (index: number) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const updatePage = (index: number, field: "label" | "url", value: string) => {
    const newPages = [...pages];
    newPages[index][field] = value;
    setPages(newPages);
  };

  const movePage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === pages.length - 1)
    ) {
      return;
    }
    const newPages = [...pages];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;
    setPages(newPages);
  };

  return (
    <div className="grid gap-4 md:col-span-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-ink">Danh sách Facebook Fanpages</label>
        <button
          type="button"
          onClick={addPage}
          className="flex items-center gap-1 rounded bg-slate-100 px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Thêm page
        </button>
      </div>

      <input
        type="hidden"
        name="facebook_pages"
        value={JSON.stringify(pages)}
      />

      {pages.length === 0 ? (
        <p className="text-sm text-muted">Chưa có Fanpage nào được thiết lập.</p>
      ) : (
        <div className="grid gap-3">
          {pages.map((page, index) => (
            <div key={index} className="flex flex-col gap-2 rounded border border-line p-3 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Tên page (VD: Pro-Fitness Vietnam)"
                value={page.label}
                onChange={(e) => updatePage(index, "label", e.target.value)}
                className="h-10 flex-1 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
              />
              <input
                type="text"
                placeholder="URL (VD: https://facebook.com/...)"
                value={page.url}
                onChange={(e) => updatePage(index, "url", e.target.value)}
                className="h-10 flex-1 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
              />
              <div className="flex items-center gap-1 justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => movePage(index, "up")}
                  disabled={index === 0}
                  className="flex h-10 w-10 items-center justify-center rounded border border-transparent text-slate-400 transition hover:bg-slate-50 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => movePage(index, "down")}
                  disabled={index === pages.length - 1}
                  className="flex h-10 w-10 items-center justify-center rounded border border-transparent text-slate-400 transition hover:bg-slate-50 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removePage(index)}
                  className="flex h-10 w-10 items-center justify-center rounded border border-transparent text-slate-400 transition hover:bg-red-50 hover:text-brand-red"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
