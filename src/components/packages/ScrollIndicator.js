"use client";

export default function ScrollIndicator({ t }) {
  return (
    <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex flex-col items-center gap-2">
        <div className="text-white/70 text-xs sm:text-sm font-medium">
          {t("packages.hero.scrollDown", "اسحب للأسفل")}
        </div>
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
