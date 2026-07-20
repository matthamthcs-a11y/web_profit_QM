import type { Json } from "@/lib/supabase/database.types";
import { AdminDeleteSubmit } from "@/components/admin-delete-submit";
import { AdminSubmitButton } from "@/components/admin-submit-button";

type InputProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

type TextareaProps = InputProps & {
  rows?: number;
};

type CheckboxProps = {
  label: string;
  name: string;
  defaultChecked?: boolean;
};

export function AdminField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  min,
  max,
  step,
}: InputProps) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-ink">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="h-10 rounded border border-line px-3 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  rows = 3,
}: TextareaProps) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-ink">
      <span>{label}</span>
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={rows}
        className="rounded border border-line px-3 py-2 text-sm font-medium outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
      />
    </label>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked = true,
}: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-black text-ink">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-brand-red"
      />
      {label}
    </label>
  );
}

export function AdminSubmit({
  label = "Lưu",
  pendingLabel,
}: {
  label?: string;
  pendingLabel?: string;
}) {
  return <AdminSubmitButton label={label} pendingLabel={pendingLabel} />;
}

export function AdminDeleteButton({
  label = "Xóa",
  message,
}: {
  label?: string;
  message?: string;
}) {
  return <AdminDeleteSubmit label={label} message={message} />;
}

export function LocalizedFields({
  base,
  label,
  value,
  textarea,
}: {
  base: string;
  label: string;
  value?: Json | null;
  textarea?: boolean;
}) {
  const vi = localized(value, "vi");
  const en = localized(value, "en");

  if (textarea) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <AdminTextarea label={`${label} VI`} name={`${base}_vi`} defaultValue={vi} />
        <AdminTextarea label={`${label} EN`} name={`${base}_en`} defaultValue={en} />
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <AdminField label={`${label} VI`} name={`${base}_vi`} defaultValue={vi} />
      <AdminField label={`${label} EN`} name={`${base}_en`} defaultValue={en} />
    </div>
  );
}

export function localized(value: Json | null | undefined, locale: "vi" | "en") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const localeValue = value[locale];
    const fallback = value.vi ?? value.en;

    if (typeof localeValue === "string") {
      return localeValue;
    }

    if (typeof fallback === "string") {
      return fallback;
    }
  }

  return "";
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-line pb-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-red">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}

