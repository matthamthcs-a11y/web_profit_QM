"use server";

import { createContactLead } from "@/lib/data/contact-leads";
import type { Locale } from "@/lib/types";

export type ContactLeadFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
  };
};

const initialError = {
  vi: "Không thể gửi thông tin lúc này. Vui lòng gọi hotline để được hỗ trợ nhanh.",
  en: "Unable to submit right now. Please call the hotline for quick support.",
};

export async function submitContactLead(
  previousState: ContactLeadFormState,
  formData: FormData,
): Promise<ContactLeadFormState> {
  void previousState;

  const locale = getLocaleFromForm(formData);
  const name = getFormString(formData, "name");
  const phone = getFormString(formData, "phone");
  const email = getFormString(formData, "email");
  const message = getFormString(formData, "message");
  const source = getFormString(formData, "source") || "contact_page";
  const productId = getFormString(formData, "productId");
  const company = getFormString(formData, "company");

  if (company) {
    return {
      ok: true,
      message:
        locale === "vi"
          ? "Cảm ơn bạn. Đội ngũ tư vấn sẽ liên hệ lại sớm."
          : "Thank you. Our team will contact you soon.",
    };
  }

  const fieldErrors: ContactLeadFormState["fieldErrors"] = {};
  const phoneDigits = phone.replace(/\D/g, "");

  if (name.length > 120) {
    fieldErrors.name =
      locale === "vi" ? "Tên quá dài." : "Name is too long.";
  }

  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    fieldErrors.phone =
      locale === "vi"
        ? "Vui lòng nhập số điện thoại hợp lệ."
        : "Please enter a valid phone number.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email =
      locale === "vi"
        ? "Email chưa đúng định dạng."
        : "Email format is invalid.";
  }

  if (message.length < 10 || message.length > 1000) {
    fieldErrors.message =
      locale === "vi"
        ? "Vui lòng nhập nội dung từ 10 đến 1000 ký tự."
        : "Please enter a message from 10 to 1000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message:
        locale === "vi"
          ? "Vui lòng kiểm tra lại thông tin."
          : "Please check the submitted information.",
      fieldErrors,
    };
  }

  const result = await createContactLead({
    name,
    phone,
    email,
    message,
    source,
    productId,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: initialError[locale],
    };
  }

  return {
    ok: true,
    message:
      locale === "vi"
        ? "Đã gửi thông tin. Đội ngũ tư vấn sẽ liên hệ lại sớm."
        : "Submitted. Our consultation team will contact you soon.",
  };
}

function getLocaleFromForm(formData: FormData): Locale {
  return formData.get("locale") === "en" ? "en" : "vi";
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}
