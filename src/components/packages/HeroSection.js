"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import { urlFor } from "@/services/sanity";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getBanners } from "@/services/apiOffers";
import Link from "next/link";
import dynamic from "next/dynamic";

// Constants
const AUTO_ROTATE_INTERVAL = 6000; // Slightly longer for better UX
const TRANSITION_DURATION = 800; // Smoother transitions

// Helper Components - Optimized for better performance
const BackdropBox = ({ children, className = "", intensity = "medium" }) => {
  const intensityClasses = {
    light: "bg-black/10 backdrop-blur-sm",
    medium: "bg-black/20 backdrop-blur-md",
    strong: "bg-black/30 backdrop-blur-lg",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 ${intensityClasses[intensity]} rounded-2xl shadow-xl border border-white/15 transition-all duration-300`}
      />
      <div className="relative p-4 sm:p-5 lg:p-6 xl:p-8">{children}</div>
    </div>
  );
};

const LoadingFallback = ({ t }) => (
  <div className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[100vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>

    <div className="relative z-30 text-center max-w-4xl sm:max-w-5xl lg:max-w-6xl px-4 sm:px-5 lg:px-8 text-white">
      <BackdropBox>
        {/* Simple spinner */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            {t("packages.loading.title", "جاري التحميل...")}
          </h2>
          <p className="text-sm sm:text-base opacity-80">
            {t("packages.loading.subtitle", "يرجى الانتظار")}
          </p>
        </div>

        {/* Simple skeleton placeholders */}
        <div className="space-y-4 mt-8">
          <div className="h-8 sm:h-10 bg-white/20 rounded-lg mx-auto max-w-md animate-pulse"></div>
          <div className="h-4 sm:h-5 bg-white/15 rounded-lg mx-auto max-w-sm animate-pulse"></div>
          <div className="h-4 sm:h-5 bg-white/15 rounded-lg mx-auto max-w-xs animate-pulse"></div>
        </div>
      </BackdropBox>
    </div>
  </div>
);

const ErrorFallback = ({ t }) => (
  <div className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[100vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-red-600 via-purple-700 to-red-800">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent"></div>
    <div className="relative z-30 text-center max-w-4xl sm:max-w-5xl lg:max-w-6xl px-4 sm:px-5 lg:px-8 text-white">
      <BackdropBox>
        <div className="space-y-6 sm:space-y-8">
          <div className="text-5xl sm:text-6xl lg:text-6xl xl:text-6xl mb-4 opacity-50">
            ⚠️
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {t("packages.error.title", "حدث خطأ")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
            {t("packages.error.subtitle", "عذراً، لا يمكن تحميل العروض حالياً")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-500/50"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              {t("packages.error.retry", "إعادة المحاولة")}
            </span>
          </button>
        </div>
      </BackdropBox>
    </div>
  </div>
);

const NoOffersPlaceholder = ({ t }) => (
  <div className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[100vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
    <div className="relative z-30 text-center max-w-4xl sm:max-w-5xl lg:max-w-6xl px-4 sm:px-5 lg:px-8 text-white">
      <BackdropBox>
        <div className="space-y-6 sm:space-y-8">
          <div className="text-5xl sm:text-6xl lg:text-6xl xl:text-6xl mb-6 animate-bounce">
            🎫
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-5xl font-bold leading-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            {t("packages.explore", "اكتشف باقاتنا")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed">
            {t("packages.subtitle", "اختر الخطة المثالية لاحتياجاتك وميزانيتك")}
          </p>
          <div className="pt-4 sm:pt-6">
            <button
              onClick={() => window.location.reload()}
              className="group bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("packages.refresh", "تحديث")}
              </span>
            </button>
          </div>
        </div>
      </BackdropBox>
    </div>
  </div>
);

const ThumbnailNavigation = dynamic(
  () => import("@/components/packages/ThumbnailNavigation"),
  { ssr: false, loading: () => null }
);

const ScrollIndicator = dynamic(
  () => import("@/components/packages/ScrollIndicator"),
  { ssr: false, loading: () => null }
);

const PriceButton = ({ offer, t }) => {
  if (!offer?.offer?.startPrice) return null;

  return (
    <Link href={`/package/${offer?.offer?.slug?.current}`} className="group">
      <button
        className="relative overflow-hidden bg-gradient-to-r from-white/15 to-white/25 
        backdrop-blur-md border-2 border-white/40 text-white hover:border-white/70 
        hover:from-white/25 hover:to-white/35 px-6 sm:px-8 lg:px-8 xl:px-12 py-3 sm:py-4 lg:py-5 xl:py-6 
        rounded-2xl font-bold text-[clamp(0.875rem,1.6vw,1.125rem)] transition-all duration-300 
        min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] xl:min-w-[240px] focus:outline-none focus:ring-2 focus:ring-white/50 
        shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
      >
        {/* Subtle animated background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        ></div>

        <div className="relative z-10 flex flex-col items-center space-y-1">
          <span className="text-[clamp(0.75rem,1.4vw,1rem)] font-semibold opacity-95">
            {t("packages.hero.startFrom", "يبدأ من")}
          </span>
          <span
            className="text-[clamp(1.125rem,2.2vw,1.25rem)] font-black bg-gradient-to-r 
            from-yellow-300 via-yellow-200 to-yellow-100 bg-clip-text text-transparent"
          >
            {offer?.offer?.startPrice} {t("packages.hero.currency", "ريال")}
          </span>
          <span className="text-[clamp(0.75rem,1.4vw,1rem)] opacity-80 font-medium">
            {t("packages.hero.perPerson", "للشخص")}
          </span>
        </div>

        {/* Simplified shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
            transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"
          ></div>
        </div>
      </button>
    </Link>
  );
};

export default function HeroSection({}) {
  const [offers, setOffers] = useState([]);
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      const offers = await getBanners(i18n.language);
      setOffers(offers);
      setIsLoading(false);
    };
    fetchOffers();
  }, [i18n.language]);

  // Memoize current offer to prevent unnecessary re-renders
  const currentOffer = useMemo(
    () => offers?.[activeIndex],
    [offers, activeIndex]
  );

  // Auto-rotate functionality with pause on hover
  useEffect(() => {
    if (!offers || offers.length <= 1 || !isAutoRotating) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [offers, isAutoRotating]);

  // Handle thumbnail click with callback optimization
  const handleThumbnailClick = useCallback((index) => {
    setActiveIndex(index);
    setIsAutoRotating(false);

    // Resume auto-rotation after 10 seconds
    setTimeout(() => setIsAutoRotating(true), 30000);
  }, []);

  // Handle browse packages with smooth scrolling
  const handleBrowsePackages = useCallback(() => {
    const packagesSection = document.getElementById("packages-section");
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Handle mouse events for auto-rotation
  const handleMouseEnter = useCallback(() => setIsAutoRotating(false), []);
  const handleMouseLeave = useCallback(() => setIsAutoRotating(true), []);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingFallback t={t} />;
  }

  // Error state
  if (error) {
    return <ErrorFallback t={t} />;
  }

  // No offers state
  if (!offers || !offers.length) {
    return <NoOffersPlaceholder t={t} />;
  }

  return (
    <section
      className="relative min-h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden 
        "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="banner"
      aria-label={t("packages.hero.section", "قسم العروض الرئيسي")}
    >
      {/* SEO: ensure an H1 with primary keywords exists for this page */}
      <h1 className="sr-only">
        باقات السفر | عروض سياحية متكاملة بأفضل الأسعار
      </h1>
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        {currentOffer?.poster?.asset && (
          <>
            <Image
              src={urlFor(currentOffer?.poster)
                .width(1920)
                .height(1080)
                .format("webp")
                .quality(75)
                .url()}
              alt={
                currentOffer?.title ||
                t("packages.hero.backgroundImage", "خلفية العرض")
              }
              fill
              className={`object-cover transition-all duration-${TRANSITION_DURATION} ease-out ${
                activeIndex === 0
                  ? ""
                  : imageLoaded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
              priority={activeIndex === 0}
              fetchPriority={activeIndex === 0 ? "high" : "auto"}
              sizes="100vw"
              onLoad={handleImageLoad}
              {...(activeIndex !== 0 && { loading: "lazy" })}
            />

            {/* Optimized loading placeholder (skip for first slide to paint faster) */}
            {activeIndex !== 0 && !imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
            )}
          </>
        )}

        {/* Simplified, performance-optimized overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
      </div>

      {/* Subtle animated elements (deferred until image loads) */}
      {imageLoaded && (
        <div className="absolute inset-0 z-10 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div
            className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      )}

      {/* Main Content - More compact for large screens */}
      <div className="relative z-30 text-center max-w-3xl lg:max-w-4xl xl:max-w-5xl px-4 sm:px-6 lg:px-8 text-white">
        <div className="space-y-6 lg:space-y-8 xl:space-y-10">
          {/* Main Heading - More compact for large screens */}
          <BackdropBox
            intensity={imageLoaded ? "medium" : "light"}
            className="transform transition-all duration-700 hover:scale-[1.02]"
          >
            <h1
              className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight 
              bg-gradient-to-b from-white via-gray-50 to-gray-200 bg-clip-text text-transparent
              drop-shadow-lg"
            >
              {currentOffer?.title || t("packages.hero.title", "اكتشف باقاتنا")}
            </h1>

            {/* Elegant underline */}
            <div
              className="w-16 sm:w-20 lg:w-20 xl:w-24 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent 
              mx-auto mt-3 lg:mt-4 xl:mt-5 rounded-full"
            ></div>
          </BackdropBox>

          {/* Subtitle - More compact for large screens */}
          <BackdropBox
            intensity="light"
            className="transform transition-all duration-700 hover:scale-[1.01]"
          >
            <p
              className="text-[clamp(1rem,1.8vw,1.25rem)] font-medium leading-relaxed 
              max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto text-gray-50/95"
            >
              {currentOffer?.description ||
                t(
                  "packages.hero.subtitle",
                  "اكتشف تجارب سفر مصممة بعناية لتخلق ذكريات لا تُنسى. من الرحلات الفاخرة إلى جولات المغامرة، ابحث عن رحلتك المثالية."
                )}
            </p>
          </BackdropBox>

          {/* Action Button */}
          <div className="flex justify-center">
            <PriceButton offer={currentOffer} t={t} />
          </div>

          {/* Package Features - Cleaner design */}
          {currentOffer?.features && (
            <BackdropBox
              intensity="light"
              className="transform transition-all duration-700 hover:scale-[1.01]"
            >
              <div className="flex flex-wrap justify-center gap-2 lg:gap-3 xl:gap-4 text-xs sm:text-sm lg:text-base">
                {currentOffer.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="group px-3 sm:px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 xl:py-3 bg-white/15 hover:bg-white/25 
                      backdrop-blur-sm rounded-full border border-white/30 hover:border-white/50 
                      font-medium transition-all duration-300 transform hover:scale-105 
                      shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center gap-1.5 lg:gap-2">
                      <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-yellow-400 rounded-full group-hover:animate-pulse"></span>
                      {feature}
                    </span>
                  </span>
                ))}
              </div>
            </BackdropBox>
          )}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <ThumbnailNavigation
        offers={offers}
        activeIndex={activeIndex}
        onThumbnailClick={handleThumbnailClick}
        t={t}
      />

      {/* Scroll Indicator */}
      <ScrollIndicator t={t} />

      {/* Enhanced Progress Indicator */}
      {offers.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-6 sm:left-8 lg:left-10 z-30">
          <div className="flex gap-2 sm:gap-3 p-3 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  index === activeIndex
                    ? "bg-gradient-to-r from-white to-gray-200 scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/80 hover:scale-110"
                }`}
                aria-label={`${t(
                  "packages.hero.goToSlide",
                  "انتقل إلى الشريحة"
                )} ${index + 1}`}
              >
                {index === activeIndex && (
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
