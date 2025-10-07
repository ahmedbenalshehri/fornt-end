"use client";
import Image from "next/image";
import heroImage from "@/assets/abouUs.jpg";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-[100vh] md:h-[100vh] flex items-center justify-center text-start">
      <Image
        src={heroImage}
        alt={t("about_us.hero_heading")}
        fill
        className="object-cover"
        priority
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10" />
      {/* Content */}
      <div className="absolute top-20 md:bottom-20 md:inset-0 z-20 flex flex-col items-center md:items-start justify-center px-6 md:px-20 animate-fadeIn">
        {/* Accent Bar */}
        <div className="h-1 w-16 bg-blue-500 rounded mb-4 md:mb-6" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 md:mb-5 drop-shadow-lg tracking-tight text-white">
          {t("about_us.hero_heading")} | فلاي مون للسفر والسياحة
        </h1>
        <p className="text-lg sm:text-lg md:text-2xl max-w-2xl drop-shadow text-white text-center md:text-start leading-8 md:leading-10 mb-2 md:mb-4">
          {t("about_us.hero_overview")}
        </p>
        <p className="text-base sm:text-base md:text-lg max-w-2xl drop-shadow text-white text-center md:text-start mt-2 md:mt-3 leading-8 md:leading-10">
          {t("about_us.hero_bref")}
        </p>
      </div>
      {/* Fade-in animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </section>
  );
}
