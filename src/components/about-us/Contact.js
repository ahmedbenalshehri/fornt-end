"use client";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden mt-10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/6 w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 bg-white/5 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-white/8 rounded-full blur-lg animate-pulse"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-5 lg:px-0 relative z-10 text-center">
        <div className="transform transition-all duration-700 hover:scale-105">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
            {t("aboutPage.cta.title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            {t("aboutPage.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <a
              href="/contact"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto justify-center"
            >
              <span className="text-sm sm:text-base">
                {t("aboutPage.cta.contact")}
              </span>
              <svg
                className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="/offers"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 group w-full sm:w-auto justify-center"
            >
              <span className="text-sm sm:text-base">
                {t("aboutPage.cta.viewOffers")}
              </span>
              <svg
                className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
