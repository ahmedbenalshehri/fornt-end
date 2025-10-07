"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineGift,
  HiOutlineAcademicCap,
  HiOutlinePaperAirplane,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

const iconMap = {
  HiOutlineGift,
  HiOutlineAcademicCap,
  HiOutlinePaperAirplane,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
};

const MainNav = ({ item, isScrolled = true }) => {
  const pathname = usePathname();
  const IconComponent = iconMap[item.icon];

  // Check if the current path matches the item route
  const isActive =
    pathname === item.route ||
    (item.route !== "/" && pathname.startsWith(item.route));

  return (
    <Link
      href={item.route}
      className={`group relative flex items-center gap-1 sm:gap-2 md:gap-3 px-1.5 sm:px-2 md:px-3 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-sm font-semibold transition-all duration-300 whitespace-nowrap min-w-max overflow-hidden ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 "
          : isScrolled
          ? "text-gray-700 hover:text-blue-600 hover:bg-white/60 hover:shadow-md hover:scale-105 hover:backdrop-blur-md"
          : "text-white hover:text-blue-200 hover:bg-white/10 hover:shadow-md hover:scale-105 hover:backdrop-blur-md"
      }`}
    >
      {/* Background effects */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl ${
          isScrolled
            ? "bg-gradient-to-r from-blue-50/80 to-purple-50/80"
            : "bg-gradient-to-r from-white/10 to-white/5"
        }`}
      ></div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg"></div>
      )}

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl blur-sm transform scale-110 ${
          isScrolled
            ? "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            : "bg-gradient-to-r from-white/20 to-white/10"
        }`}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-1 sm:gap-2 md:gap-3">
        {IconComponent && (
          <div
            className={`flex-shrink-0 transition-transform duration-200 hover:scale-110 ${
              isActive
                ? "text-white"
                : isScrolled
                ? "text-gray-600 group-hover:text-blue-600"
                : "text-white group-hover:text-blue-200"
            }`}
          >
            <IconComponent className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </div>
        )}

        <span
          className={`font-medium transition-colors duration-300 ${
            isActive
              ? "text-white"
              : isScrolled
              ? "text-gray-700 group-hover:text-blue-600"
              : "text-white group-hover:text-blue-200"
          }`}
        >
          {item.name}
        </span>

        {/* Active indicator dot */}
        {isActive && (
          <div className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full shadow-sm"></div>
        )}
      </div>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-150">
        <div
          className={`absolute inset-0 rounded-lg sm:rounded-xl animate-ping ${
            isScrolled ? "bg-white/20" : "bg-white/10"
          }`}
        ></div>
      </div>
    </Link>
  );
};

export default MainNav;
