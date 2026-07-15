"use client";

import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/types";

type AdminAssetFieldProps = {
  label: string;
  name: string;
  defaultValue?: string | null;
  folder: string;
  accept?: string;
  required?: boolean;
  maxSizeMb?: number;
  locale?: Locale;
};

const BUCKET = "profitness-assets";
const copy = {
  vi: {
    placeholder: "Dán đường dẫn ảnh hoặc chọn ảnh từ máy tính",
    selectFile: "Chọn ảnh",
    openFile: "Mở ảnh",
    tooLarge: (maxSizeMb: number) =>
      `File quá lớn. Giới hạn hiện tại là ${maxSizeMb}MB.`,
    uploading: "Đang tải ảnh lên...",
    uploadFailed: "Upload thất bại.",
    uploadSuccess: "Đã upload và tự điền đường dẫn.",
  },
  en: {
    placeholder: "Paste an image URL or choose a file from your computer",
    selectFile: "Choose image",
    openFile: "Open image",
    tooLarge: (maxSizeMb: number) =>
      `File is too large. Current limit is ${maxSizeMb}MB.`,
    uploading: "Uploading image...",
    uploadFailed: "Upload failed.",
    uploadSuccess: "Uploaded and filled the URL automatically.",
  },
} satisfies Record<Locale, {
  placeholder: string;
  selectFile: string;
  openFile: string;
  tooLarge: (maxSizeMb: number) => string;
  uploading: string;
  uploadFailed: string;
  uploadSuccess: string;
}>;

export function AdminAssetField({
  label,
  name,
  defaultValue,
  folder,
  accept = "image/*",
  required,
  maxSizeMb = 25,
  locale = "vi",
}: AdminAssetFieldProps) {
  const t = copy[locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const isImage = useMemo(() => {
    if (accept.includes("image")) return true;
    return /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(value);
  }, [accept, value]);

  async function uploadFile(file: File) {
    const maxBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maxBytes) {
      setStatus("error");
      setMessage(t.tooLarge(maxSizeMb));
      return;
    }

    setStatus("uploading");
    setMessage(t.uploading);

    const supabase = createSupabaseBrowserClient();
    const path = `${cleanPathPart(folder)}/${Date.now()}-${crypto.randomUUID()}-${cleanFileName(
      file.name,
    )}`;

    const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type || undefined,
      upsert: false,
    });

    if (error || !data?.path) {
      setStatus("error");
      setMessage(error?.message ?? t.uploadFailed);
      return;
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    setValue(publicData.publicUrl);
    setStatus("success");
    setMessage(t.uploadSuccess);
  }

  return (
    <label className="grid gap-1.5 text-sm font-bold text-ink">
      <span>{label}</span>
      <input
        name={name}
        type="text"
        required={required}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setStatus("idle");
          setMessage("");
        }}
        placeholder={t.placeholder}
        className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) {
              void uploadFile(file);
            }
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="inline-flex h-9 items-center gap-2 rounded border border-line bg-white px-3 text-xs font-black uppercase text-ink hover:border-brand-red disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "uploading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {t.selectFile}
        </button>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded border border-line px-3 text-xs font-bold text-muted hover:text-brand-red"
          >
            {t.openFile}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
      {message ? (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
            status === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {status === "error" ? (
            <AlertCircle className="h-3.5 w-3.5" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          {message}
        </span>
      ) : null}
      {isImage && value ? (
        <span className="block overflow-hidden rounded border border-line bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-28 w-full object-contain p-2" />
        </span>
      ) : null}
    </label>
  );
}

function cleanPathPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanFileName(value: string) {
  const fallback = "asset";
  const parts = value.split(".");
  const extension =
    parts.length > 1 ? parts.pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const name = parts
    .join(".")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${name || fallback}${extension ? `.${extension}` : ""}`;
}
