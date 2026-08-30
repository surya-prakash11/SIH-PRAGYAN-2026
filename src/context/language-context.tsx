"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { type Language, type TranslationKey, getTranslation, LANGUAGES } from "@/shared/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  languages: typeof LANGUAGES;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "pragyan_lang";

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: React.ReactNode;
  initialLang?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLang);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && (saved === "en" || saved === "hi" || saved === "te")) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {}
  }, []);

  const setLanguage = (newLang: Language) => {
    startTransition(() => {
      setLanguageState(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
        document.cookie = `vs_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = newLang;
        window.dispatchEvent(new CustomEvent("pragyan:lang-change", { detail: { lang: newLang } }));
      } catch {}
    });
  };

  const t = (key: TranslationKey, fallback?: string) => {
    const val = getTranslation(key, language);
    return val || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: TranslationKey, fallback?: string) => getTranslation(key, "en") || fallback || key,
      languages: LANGUAGES,
    };
  }
  return ctx;
}
