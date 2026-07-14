"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { submitContactLead, type ContactLeadFormState } from "@/app/contact/actions";
import type { Locale } from "@/lib/types";

type ContactLeadFormProps = {
  locale: Locale;
  source?: string;
  productId?: string;
};

const initialState: ContactLeadFormState = {
  ok: false,
  message: "",
};

const labels = {
  vi: {
    title: "Gửi yêu cầu tư vấn",
    description:
      "Điền thông tin cần tư vấn. Sales sẽ liên hệ lại để hỗ trợ chọn sản phẩm, vị, giá và cách sử dụng phù hợp.",
    name: "Họ tên",
    phone: "Số điện thoại",
    email: "Email",
    message: "Nội dung cần tư vấn",
    submit: "Gửi yêu cầu",
    submitting: "Đang gửi...",
    namePlaceholder: "Nguyễn Văn A",
    phonePlaceholder: "02838481014",
    emailPlaceholder: "email@example.com",
    messagePlaceholder: "Tôi cần tư vấn sản phẩm gel năng lượng cho chạy bộ...",
    optional: "không bắt buộc",
  },
  en: {
    title: "Request consultation",
    description:
      "Send your question. Sales will contact you to advise on products, flavors, prices and usage.",
    name: "Full name",
    phone: "Phone number",
    email: "Email",
    message: "Consultation request",
    submit: "Send request",
    submitting: "Sending...",
    namePlaceholder: "Your name",
    phonePlaceholder: "02838481014",
    emailPlaceholder: "email@example.com",
    messagePlaceholder: "I need product advice for endurance training...",
    optional: "optional",
  },
} as const;

export function ContactLeadForm({
  locale,
  source = "contact_page",
  productId,
}: ContactLeadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitContactLead,
    initialState,
  );
  const t = labels[locale];

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <div className="rounded border border-line bg-surface p-6">
      <h2 className="text-2xl font-black text-ink">{t.title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{t.description}</p>

      <form ref={formRef} action={formAction} className="mt-6 grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="source" value={source} />
        {productId ? <input type="hidden" name="productId" value={productId} /> : null}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <FieldError message={state.fieldErrors?.name} />
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase text-muted">
            {t.name} <span className="font-semibold normal-case">({t.optional})</span>
          </span>
          <input
            name="name"
            maxLength={120}
            placeholder={t.namePlaceholder}
            className="h-12 rounded border border-line bg-white px-4 text-sm font-semibold text-ink outline-none focus:border-brand-red"
          />
        </label>

        <FieldError message={state.fieldErrors?.phone} />
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase text-muted">{t.phone}</span>
          <input
            name="phone"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder={t.phonePlaceholder}
            className="h-12 rounded border border-line bg-white px-4 text-sm font-semibold text-ink outline-none focus:border-brand-red"
          />
        </label>

        <FieldError message={state.fieldErrors?.email} />
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase text-muted">
            {t.email} <span className="font-semibold normal-case">({t.optional})</span>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t.emailPlaceholder}
            className="h-12 rounded border border-line bg-white px-4 text-sm font-semibold text-ink outline-none focus:border-brand-red"
          />
        </label>

        <FieldError message={state.fieldErrors?.message} />
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase text-muted">
            {t.message}
          </span>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            placeholder={t.messagePlaceholder}
            className="resize-none rounded border border-line bg-white px-4 py-3 text-sm font-semibold leading-6 text-ink outline-none focus:border-brand-red"
          />
        </label>

        {state.message ? (
          <p
            aria-live="polite"
            className={`rounded border px-4 py-3 text-sm font-bold ${
              state.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-brand-red"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded bg-brand-red px-5 text-sm font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-4 w-4" />
          {pending ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm font-bold text-brand-red">{message}</p>;
}
