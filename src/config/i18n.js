import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import arTranslation from "../locales/ar/translation.json";
import enTranslation from "../locales/en/translation.json";

const resources = {
  ar: {
    translation: arTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // Arabic as default language
    fallbackLng: "ar",

    detection: {
      order: [
        "localStorage",
        "cookie",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage", "cookie"],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: false,
    },

    // Language switching configuration
    supportedLngs: ["ar", "en"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",

    // RTL configuration
    rtl: {
      ar: true,
      en: false,
    },
  });

export default i18n;
