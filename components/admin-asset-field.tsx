"use client";

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Upload,
} from "lucide-react";
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
  optimizeImage?: {
    maxWidth: number;
    maxHeight: number;
    quality?: number;
  };
};

const BUCKET = "profitness-assets";

const copy = {
  vi: {
    placeholder: "Dán đường dẫn ảnh hoặc chọn ảnh từ máy tính",
    selectFile: "Chọn ảnh",
    openFile: "Mở ảnh",
    tooLarge: (maxSizeMb: number) =>
      `File quá lớn. Giới hạn hiện tại là ${maxSizeMb}MB.`,
    optimizing: "Đang tối ưu ảnh...",
    uploading: "Đang tải ảnh lên...",
    uploadFailed: "Upload thất bại.",
    optimizeFailed:
      "Không thể tối ưu ảnh. Vui lòng thử file JPG, PNG hoặc WebP khác.",
    uploadSuccess: "Đã upload và tự điền đường dẫn.",
    optimizedUploadSuccess: "Đã tối ưu WebP và upload ảnh.",
  },
  en: {
    placeholder: "Paste an image URL or choose a file from your computer",
    selectFile: "Choose image",
    openFile: "Open image",
    tooLarge: (maxSizeMb: number) =>
      `File is too large. Current limit is ${maxSizeMb}MB.`,
    optimizing: "Optimizing image...",
    uploading: "Uploading image...",
    uploadFailed: "Upload failed.",
    optimizeFailed:
      "Could not optimize this image. Please try another JPG, PNG or WebP file.",
    uploadSuccess: "Uploaded and filled the URL automatically.",
    optimizedUploadSuccess: "Optimized to WebP and uploaded.",
  },
} satisfies Record<
  Locale,
  {
    placeholder: string;
    selectFile: string;
    openFile: string;
    tooLarge: (maxSizeMb: number) => string;
    optimizing: string;
    uploading: string;
    uploadFailed: string;
    optimizeFailed: string;
    uploadSuccess: string;
    optimizedUploadSuccess: string;
  }
>;

export function AdminAssetField({
  label,
  name,
  defaultValue,
  folder,
  accept = "image/*",
  required,
  maxSizeMb = 25,
  locale = "vi",
  optimizeImage,
}: AdminAssetFieldProps) {
  const t = copy[locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
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
    setMessage(optimizeImage ? t.optimizing : t.uploading);

    let uploadTarget = file;
    let wasOptimized = false;

    if (optimizeImage && isRasterImage(file)) {
      try {
        uploadTarget = await optimizeImageFile(file, {
          maxWidth: optimizeImage.maxWidth,
          maxHeight: optimizeImage.maxHeight,
          quality: optimizeImage.quality ?? 0.84,
        });
        wasOptimized = true;
      } catch {
        setStatus("error");
        setMessage(t.optimizeFailed);
        return;
      }
    }

    setMessage(t.uploading);

    const supabase = createSupabaseBrowserClient();
    const path = `${cleanPathPart(folder)}/${Date.now()}-${crypto.randomUUID()}-${cleanFileName(
      uploadTarget.name,
    )}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, uploadTarget, {
        cacheControl: "31536000",
        contentType: uploadTarget.type || undefined,
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
    setMessage(wasOptimized ? t.optimizedUploadSuccess : t.uploadSuccess);
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

function isRasterImage(file: File) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
}

async function optimizeImageFile(
  file: File,
  options: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
  },
) {
  const image = await loadImage(file);
  const scale = Math.min(
    1,
    options.maxWidth / image.naturalWidth,
    options.maxHeight / image.naturalHeight,
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    throw new Error("Canvas is not supported.");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", options.quality);
  });

  if (!blob) {
    throw new Error("WebP conversion failed.");
  }

  return new File([blob], `${stripExtension(file.name) || "banner"}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed."));
    };
    image.src = url;
  });
}

function stripExtension(value: string) {
  const dotIndex = value.lastIndexOf(".");
  const name = dotIndex > 0 ? value.slice(0, dotIndex) : value;

  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
