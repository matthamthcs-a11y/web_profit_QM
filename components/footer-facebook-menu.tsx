"use client";

import { useState, useRef, useEffect } from "react";
import { FacebookBrandIcon } from "@/components/brand-social-icons";

function isExternalHref(href?: string) {
  return Boolean(href?.startsWith("http://") || href?.startsWith("https://"));
}

export function FooterFacebookMenu({
  pages,
}: {
  pages: { label: string; url: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!pages || pages.length === 0) {
    return (
      <span aria-label="Facebook" className="flex h-8 w-8 items-center justify-center opacity-40">
        <FacebookBrandIcon className="h-5 w-5" />
      </span>
    );
  }

  if (pages.length === 1) {
    const page = pages[0];
    return (
      <a
        href={page.url}
        target={isExternalHref(page.url) ? "_blank" : undefined}
        rel={isExternalHref(page.url) ? "noreferrer" : undefined}
        aria-label={page.label || "Facebook"}
        className="flex h-8 w-8 items-center justify-center text-white transition hover:text-brand-red"
      >
        <FacebookBrandIcon className="h-5 w-5" />
      </a>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Facebook Pages"
        className={`flex h-8 w-8 items-center justify-center transition ${isOpen ? "text-brand-red" : "text-white hover:text-brand-red"}`}
      >
        <FacebookBrandIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 rounded bg-white shadow-xl ring-1 ring-black/5 z-50">
          <div className="py-1">
            {pages.map((page, index) => (
              <a
                key={index}
                href={page.url}
                target={isExternalHref(page.url) ? "_blank" : undefined}
                rel={isExternalHref(page.url) ? "noreferrer" : undefined}
                className="block px-4 py-2 text-sm text-ink hover:bg-slate-50 hover:text-brand-red truncate"
              >
                {page.label || "Facebook"}
              </a>
            ))}
          </div>
          <div className="absolute -bottom-2 left-2.5 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}
    </div>
  );
}
