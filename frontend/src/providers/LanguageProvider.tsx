import React, { useState, useEffect } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { type Language } from "../../types/types";
import en from "../locale/en";
import ar from "../locale/ar";

const translations = { en, ar };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const isRTL = language === "ar";

  const t = (key: string): string => {
    return translations[language][key as keyof typeof en] || key;
  };

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}
