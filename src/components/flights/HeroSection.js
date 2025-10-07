"use client";

import SearchBar from "../search/SearchBar";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useWebSettings } from "@/hooks/useWebSettings";

export default function HeroSection() {
  const { t } = useTranslation();
  const { isLoading, error } = useWebSettings();

  return (
    <div className="relative min-h-[0vh] sm:min-h-[70vh] lg:min-h-[80vh] w-full flex flex-col items-center justify-center mt-16 sm:mt-20">
      {/* Background with overlay using next/image for optimization */}
      <Image
        src="/heroSection.png"
        alt={t("flights.hero.background_alt")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center sm:object-bottom z-10"
        quality={80}
      />

      {/* Web Settings Loading/Error Status Display */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-40 bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 text-xs text-blue-800">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Loading settings...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 right-4 z-40 bg-red-100 border border-red-300 rounded-lg px-3 py-2 text-xs text-red-800">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span>Settings Error</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-30 text-center max-w-6xl px-4 sm:px-6 lg:px-8 text-gray-600 hidden lg:block">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 lg:mb-6 leading-tight drop-shadow-lg">
            {t("flights.hero.title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl font-normal leading-relaxed opacity-90 drop-shadow-md max-w-4xl mx-auto">
            {t("flights.hero.subtitle")}
          </p>
        </div>
      </div>
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-0">
        <SearchBar />
      </div>
    </div>
  );
}
