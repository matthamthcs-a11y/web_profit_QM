"use client";

type AdminDeleteSubmitProps = {
  label?: string;
  message?: string;
};

export function AdminDeleteSubmit({
  label = "Xóa",
  message = "Bạn chắc chắn muốn xóa dữ liệu này?",
}: AdminDeleteSubmitProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className="h-10 rounded border border-red-200 px-4 text-sm font-black uppercase text-brand-red hover:bg-red-50"
    >
      {label}
    </button>
  );
}