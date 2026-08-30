"use client";

import { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { type Language, LANGUAGES } from "@/shared/i18n";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white/80 px-2.5 py-1 text-xs font-bold text-navy-800 shadow-sm backdrop-blur transition hover:border-saffron-400 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-saffron-400 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("select_language")}
      >
        <Languages className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
        <span className="inline-flex items-center gap-1">
          <span>{current.flag}</span>
          <span className="font-semibold">{current.nativeName}</span>
        </span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-44 origin-top-right rounded-lg border border-navy-100 bg-white p-1 shadow-lg ring-1 ring-black/5 backdrop-blur focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10"
        >
          <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t("select_language")}
          </div>
          {LANGUAGES.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                role="menuitem"
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-bold transition ${
                  isSelected
                    ? "bg-saffron-50 text-saffron-900 dark:bg-saffron-950/50 dark:text-saffron-300"
                    : "text-navy-800 hover:bg-navy-50 hover:text-navy-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{item.flag}</span>
                  <span>{item.nativeName}</span>
                  <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                    ({item.label})
                  </span>
                </span>
                {isSelected && <Check className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
