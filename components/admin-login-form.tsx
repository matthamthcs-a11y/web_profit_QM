"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAdmin, type AdminLoginFormState } from "@/app/admin/login/actions";

const initialState: AdminLoginFormState = {
  message: "",
};

export function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-black uppercase">
          Email admin
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 rounded border border-line px-4 text-base outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
          placeholder="admin@example.com"
        />
        {state.fieldErrors?.email ? (
          <p className="text-sm font-semibold text-brand-red">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-black uppercase">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12 rounded border border-line px-4 text-base outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
          placeholder="••••••••"
        />
        {state.fieldErrors?.password ? (
          <p className="text-sm font-semibold text-brand-red">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <div className="rounded border border-brand-red/30 bg-red-50 px-4 py-3 text-sm font-semibold text-brand-red">
          {state.message}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 rounded bg-brand-red px-5 text-sm font-black uppercase text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Đang đăng nhập..." : "Đăng nhập"}
    </button>
  );
}
