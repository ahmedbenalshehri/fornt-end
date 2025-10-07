"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { RiUserLine, RiLogoutBoxLine, RiSettingsLine } from "react-icons/ri";
import MainNav from "./MainNav";
import AuthModal from "./AuthModal";
import {
  HiOutlineGift,
  HiOutlineGlobeAlt,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlinePhone,
} from "react-icons/hi2";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
      if (isLanguageOpen && !event.target.closest(".language-dropdown")) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen, isLanguageOpen]);

  // Force scrolled header style on flights page
  const shouldShowScrolledHeader =
    isScrolled ||
    pathname === "/" ||
    pathname === "/flights" ||
    pathname.startsWith("/flights") ||
    pathname.startsWith("/profile");

  const navigation = [
    // {
    //   name: t("common.flights"),
    //   href: "/flights",
    //   route: "/flights",
    //   icon: "HiOutlinePaperAirplane",
    // },
    {
      name: t("common.home"),
      href: "/",
      route: "/",
      icon: "HiOutlineHome",
    },
    {
      name: t("common.packages"),
      href: "/packages",
      route: "/packages",
      icon: "HiOutlineGift",
    },

    // {
    //   name: t("common.hotels"),
    //   href: "/hotels",
    //   route: "/hotels",
    //   icon: "HiOutlineBuildingOffice2",
    // },

    {
      name: t("common.about"),
      href: "/about-us",
      route: "/about-us",
      icon: "HiOutlineInformationCircle",
    },
    {
      name: t("common.contact"),
      href: "/contact",
      route: "/contact",
      icon: "HiOutlinePhone",
    },
  ];

  const handleLanguageChange = (language) => {
    changeLanguage(language.code);
    setIsLanguageOpen(false);
  };

  const handleProfileAction = (action) => {
    setIsProfileOpen(false);
    if (action === "profile") {
      router.push("/profile");
    } else if (action === "logout") {
      logout();
    }
  };

  return (
    <header
      className={`${
        shouldShowScrolledHeader
          ? "bg-white border-gray-200"
          : "bg-gray-900/10 backdrop-blur-md"
      } shadow-lg fixed w-full h-16 md:h-20 top-0 z-50 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {shouldShowScrolledHeader ? (
              <Image
                src="/logo.png"
                alt={t("header.logo_alt")}
                width={100}
                height={100}
                sizes="(max-width: 768px) 100px, 120px"
                className="md:w-[100px] md:h-[100px]"
              />
            ) : (
              <Image
                src="/light-logo.png"
                alt={t("header.logo_alt")}
                width={100}
                height={100}
                sizes="(max-width: 768px) 100px, 120px"
                className="md:w-[100px] md:h-[100px]"
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4">
            {navigation.map((item) => (
              <MainNav
                key={item.name}
                item={item}
                isScrolled={shouldShowScrolledHeader}
              />
            ))}
          </nav>
          {/* <nav className=" flex md:gap-4 w-full  gap-10 bg-white top-[64px] left-0 px-4 py-4 border-t border-gray-200 fixed md:hidden">
            {navigation.map((item) => (
              <MainNav key={item.name} item={item} />
            ))}
          </nav> */}
          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative language-dropdown">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  shouldShowScrolledHeader
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-blue-800/50"
                }`}
                title={t("header.language_selector")}
              >
                <span className="text-sm font-medium">
                  {currentLanguage.toUpperCase()}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
                    shouldShowScrolledHeader
                      ? "bg-white border border-gray-200"
                      : "bg-blue-800/95 backdrop-blur-md border border-blue-700/30"
                  }`}
                >
                  <div className="py-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                          shouldShowScrolledHeader
                            ? `hover:bg-gray-50 ${
                                currentLanguage === language.code
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-700"
                              }`
                            : `hover:bg-blue-700/50 ${
                                currentLanguage === language.code
                                  ? "bg-blue-600 text-white"
                                  : "text-white"
                              }`
                        }`}
                      >
                        <span>{language.flag}</span>
                        <span>{language.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    shouldShowScrolledHeader
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-blue-800/50"
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <RiUserLine className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email?.split("@")[0] || t("common.user", "User")}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
                      shouldShowScrolledHeader
                        ? "bg-white border border-gray-200"
                        : "bg-blue-800/95 backdrop-blur-md border border-blue-700/30"
                    }`}
                  >
                    <div className="py-2">
                      <button
                        onClick={() => handleProfileAction("profile")}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                          shouldShowScrolledHeader
                            ? "hover:bg-gray-50 text-gray-700"
                            : "hover:bg-blue-700/50 text-white"
                        }`}
                      >
                        <RiUserLine className="w-4 h-4" />
                        <span>{t("profile.title", "Profile")}</span>
                      </button>
                      <button
                        onClick={() => handleProfileAction("logout")}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                          shouldShowScrolledHeader
                            ? "hover:bg-red-50 text-red-600"
                            : "hover:bg-red-600/50 text-red-300"
                        }`}
                      >
                        <RiLogoutBoxLine className="w-4 h-4" />
                        <span>{t("common.logout", "Logout")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  {t("common.login")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 relative ${
              shouldShowScrolledHeader
                ? "text-gray-700 hover:bg-gray-100 hover:scale-105"
                : "text-white hover:bg-blue-800/50 hover:scale-105"
            }`}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`mobile-menu-button-line block h-0.5 w-6 bg-current ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
                }`}
              />
              <span
                className={`mobile-menu-button-line block h-0.5 w-6 bg-current ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`mobile-menu-button-line block h-0.5 w-6 bg-current ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className=" fixed inset-0 top-0 h-screen  z-40 md:hidden animate-slide-in-top"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile menu panel */}
            <div
              className={`mobile-menu-panel ${
                isMenuOpen ? "open" : "closed"
              } md:hidden fixed w-full top-16 left-0 z-50 h-screen ${
                shouldShowScrolledHeader
                  ? "bg-white border-b border-gray-200 shadow-xl"
                  : "bg-gray-900/95  border-b border-blue-700/30 shadow-xl"
              }`}
            >
              <div className="px-6 py-6">
                <nav className="flex flex-col space-y-3">
                  {navigation.map((item, index) => {
                    const IconComponent =
                      {
                        HiOutlineHome,
                        HiOutlineGift,
                        HiOutlineInformationCircle,
                        HiOutlinePhone,
                      }[item.icon] || HiOutlineGlobeAlt;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`mobile-menu-item group flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-[1.02] animate-stagger-fade-in ${
                          pathname === item.route
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : shouldShowScrolledHeader
                            ? "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-md"
                            : "text-white hover:bg-white/10 hover:text-blue-100 hover:shadow-md"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <span className="text-xl">
                          <IconComponent className="w-5 h-5" />
                        </span>
                        <span className="flex-1">{item.name}</span>
                        {pathname === item.route && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
                {/* Mobile Language and Login Section */}
                <div
                  className={`mt-6 pt-6 border-t ${
                    shouldShowScrolledHeader
                      ? "border-gray-200"
                      : "border-blue-700/30"
                  }`}
                >
                  {/* Mobile Language Selector */}
                  <div className="mb-6">
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                        shouldShowScrolledHeader
                          ? "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                          : "text-white hover:bg-white/10 hover:shadow-md"
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <span className="text-xl">🌐</span>
                        <span className="text-base font-medium">
                          {t("common.language")}:{" "}
                          {currentLanguage.toUpperCase()}
                        </span>
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isLanguageOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isLanguageOpen && (
                      <div
                        className={`mt-3 rounded-xl overflow-hidden shadow-lg ${
                          shouldShowScrolledHeader
                            ? "bg-white border border-gray-200"
                            : "bg-gray-800/50 backdrop-blur-sm border border-blue-700/30"
                        }`}
                      >
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language)}
                            className={`w-full flex items-center space-x-4 px-4 py-3 text-sm transition-all duration-200 ${
                              shouldShowScrolledHeader
                                ? `hover:bg-gray-50 ${
                                    currentLanguage === language.code
                                      ? "bg-blue-50 text-blue-600"
                                      : "text-gray-700"
                                  }`
                                : `hover:bg-blue-700/50 ${
                                    currentLanguage === language.code
                                      ? "bg-blue-600 text-white"
                                      : "text-white"
                                  }`
                            }`}
                          >
                            <span className="text-lg">{language.flag}</span>
                            <span className="flex-1 text-left">
                              {language.nativeName}
                            </span>
                            {currentLanguage === language.code && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Auth Section */}
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div
                        className={`text-center p-4 rounded-xl ${
                          shouldShowScrolledHeader
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200"
                            : "bg-gradient-to-r from-blue-800/50 to-purple-800/50 border border-blue-700/30"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-3 mb-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              shouldShowScrolledHeader
                                ? "bg-blue-100"
                                : "bg-blue-600/50"
                            }`}
                          >
                            <RiUserLine
                              className={`w-6 h-6 ${
                                shouldShowScrolledHeader
                                  ? "text-blue-600"
                                  : "text-white"
                              }`}
                            />
                          </div>
                        </div>
                        <p
                          className={`text-base font-medium ${
                            shouldShowScrolledHeader
                              ? "text-gray-700"
                              : "text-white"
                          }`}
                        >
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email}
                        </p>
                        <p
                          className={`text-sm ${
                            shouldShowScrolledHeader
                              ? "text-gray-500"
                              : "text-blue-200"
                          }`}
                        >
                          {t("common.welcome", "Welcome")}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleProfileAction("profile");
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-base font-medium flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        <RiUserLine className="w-5 h-5" />
                        <span>{t("profile.title", "Profile")}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleProfileAction("logout");
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-base font-medium flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        <RiLogoutBoxLine className="w-5 h-5" />
                        <span>{t("common.logout", "Logout")}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsLoginOpen(true);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        {t("common.login")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(user) => {
          console.log("Authentication successful:", user);
          // The AuthContext will automatically update the state
        }}
      />
    </header>
  );
}
