"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AdminSlugFieldProps = {
  label?: string;
  name?: string;
  defaultValue?: string | null;
  sourceName: string;
};

export function AdminSlugField({
  label = "Slug",
  name = "slug",
  defaultValue,
  sourceName,
}: AdminSlugFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const rootRef = useRef<HTMLLabelElement>(null);
  const touchedRef = useRef(Boolean(defaultValue));
  const initialValue = useMemo(() => defaultValue ?? "", [defaultValue]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    const input = form?.querySelector<HTMLInputElement>(`input[name="${sourceName}"]`);

    if (!input) {
      return;
    }

    function updateSlug() {
      if (touchedRef.current) {
        return;
      }

      setValue(slugify(input?.value ?? ""));
    }

    input.addEventListener("input", updateSlug);

    if (!initialValue) {
      updateSlug();
    }

    return () => input.removeEventListener("input", updateSlug);
  }, [initialValue, sourceName]);

  return (
    <label ref={rootRef} className="grid gap-1.5 text-sm font-bold text-ink">
      <span>{label}</span>
      <input
        name={name}
        type="text"
        value={value}
        onChange={(event) => {
          touchedRef.current = true;
          setValue(slugify(event.target.value));
        }}
        onBlur={() => setValue((current) => slugify(current))}
        placeholder="tu-dong-tao-tu-ten-en"
        className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
      />
      <span className="text-xs font-semibold text-muted">
        Tự tạo từ tên tiếng Anh. Có thể sửa thủ công nếu cần.
      </span>
    </label>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
