"use client";

import { useState } from "react";
import { X, Phone } from "lucide-react";

export function DealerContactPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-2 text-sm font-bold text-brand-red hover:text-white transition-colors text-left inline-block"
      >
        Bạn muốn trở thành đại lý?
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-ink">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-ink transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-2 text-xl font-black text-ink">
              Trở thành đại lý
            </h3>
            <p className="mb-6 text-sm text-muted">
              Vui lòng liên hệ với chúng tôi qua số điện thoại bên dưới để được tư vấn chính sách đại lý tốt nhất.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="tel:0906845179"
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-red py-3 font-bold text-white transition-colors hover:bg-red-700"
              >
                <Phone className="h-5 w-5" />
                090 684 51 79
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
