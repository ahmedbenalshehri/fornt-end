"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import "../config/i18n";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("ar");
  const [isRTL, setIsRTL] = useState(true);

  const changeLanguage = useCallback(
    (languageCode) => {
      setCurrentLanguage(languageCode);
      i18n.changeLanguage(languageCode);
      localStorage.setItem("language", languageCode);
    },
    [i18n]
  );

  useEffect(() => {
    // Set initial language
    const savedLanguage = localStorage.getItem("language") || "ar";
    changeLanguage(savedLanguage);
  }, [changeLanguage]);

  useEffect(() => {
    // Update RTL based on current language
    setIsRTL(i18n.language === "ar");

    // Update HTML attributes
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";

    // Update body class for styling
    document.body.className = document.body.className.replace(
      /\b(rtl|ltr)\b/g,
      ""
    );
    document.body.classList.add(i18n.language === "ar" ? "rtl" : "ltr");
  }, [i18n.language]);

  const languages = [
    { code: "ar", name: "العربية", flag: "🇸🇦", nativeName: "العربية" },
    { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  ];

  const value = {
    currentLanguage,
    isRTL,
    changeLanguage,
    languages,
    i18n,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
