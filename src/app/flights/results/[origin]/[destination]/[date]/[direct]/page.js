"use client";

import { useSearchParams } from "next/navigation";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import FlightResults from "@/components/flights/FlightResults";
import FlightResultsSkeleton from "@/components/flights/FlightResultsSkeleton";
import SearchFilters from "@/components/search/SearchFilters";
import SearchFiltersSkeleton from "@/components/search/SearchFiltersSkeleton";
import Spinner from "@/components/common/Spinner";
import { generatePageMetadata } from "@/utils/metadata";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { useTranslation } from "react-i18next";
import SearchBar from "@/components/search/SearchBar";
import { useRouter } from "next/navigation";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function FlightResultsPage({ params }) {
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { isRTL } = useLanguage();
  const router = useRouter();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [originLabel, setOriginLabel] = useState("");
  const [destinationLabel, setDestinationLabel] = useState("");
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);

  // Unwrap params using React.use() for Next.js compatibility
  const { origin, destination, date, direct } = use(params);

  // Parse date parameter to extract start and end dates for round trips
  const parseDateParam = (dateParam) => {
    if (dateParam.includes("_")) {
      // Date range format: startDate_endDate
      const [start, end] = dateParam.split("_");
      return {
        startDate: start,
        endDate: end,
        isRoundTrip: true,
      };
    } else {
      // Single date format
      return {
        startDate: dateParam,
        endDate: null,
        isRoundTrip: false,
      };
    }
  };

  const { startDate, endDate, isRoundTrip } = parseDateParam(date);

  // Access localStorage only after component mount
  useEffect(() => {
    console.log(localStorage.getItem("flymoon_search_form"));
    const storedOriginLabel = JSON.parse(
      localStorage.getItem("flymoon_search_form")
    ).departure;
    const storedDestinationLabel = JSON.parse(
      localStorage.getItem("flymoon_search_form")
    ).arrival;
    JSON.parse(localStorage.getItem("flymoon_search_form")).arrival;
    JSON.parse(localStorage.getItem("flymoon_search_form")).arrival;
    JSON.parse(localStorage.getItem("flymoon_search_form")).arrival;
    console.log(storedOriginLabel, storedDestinationLabel);
    setOriginLabel(storedOriginLabel);
    setDestinationLabel(storedDestinationLabel);
  }, [origin, destination]);

  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const infants = searchParams.get("infants") || "0";
  const cabinClass = searchParams.get("cabinClass") || "E";

  const {
    results,
    isLoading,
    error,
    airlineOptions,
    currency,
    sortBy,
    onFilterChange,
    onSortChange,
    onLoadMore,
    canLoadMore,
    isInitialLoad,
    isSearching,
    isFiltering,
    totalFlightsFound,
  } = useFlightSearch({
    origin,
    destination,
    date,
    direct,
    adults,
    children,
    infants,
    cabinClass,
  });

  // Determine trip type from flight results
  const tripType =
    results && results.length > 0 && results[0].isRoundTrip
      ? "roundtrip"
      : "oneway";
  console.log(results);
  const getCabinClassLabel = (cabinClass) => {
    const cabinMap = {
      E: t("flights.cabin_class.economy"),
      B: t("flights.cabin_class.business"),
      F: t("flights.cabin_class.first"),
    };
    return cabinMap[cabinClass] || t("flights.cabin_class.economy");
  };

  const dateLocale = i18n.language === "ar" ? "ar-SA" : "en-US";

  const handleSearchModeToggle = () => {
    setIsSearchMode(!isSearchMode);
  };

  const handleSearchSubmit = (searchData) => {
    // Navigate to new search results
    const searchParams = new URLSearchParams({
      adults: searchData.adults || adults,
      children: searchData.children || children,
      infants: searchData.infants || infants,
      cabinClass: searchData.cabinClass || cabinClass,
    });

    router.push(
      `/flights/results/${searchData.origin}/${searchData.destination}/${
        searchData.date
      }/${searchData.direct}?${searchParams.toString()}`
    );
    setIsSearchMode(false);
  };

  const handleBackToSearch = () => {
    router.back();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
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
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t("flights.results.error.title")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto">
              {t("flights.results.error.message")}
            </p>
            <Link
              href="/flights"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t("flights.results.error.back_to_search")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 mt-5 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 sm:mb-6 lg:mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base">
            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {t("common.home")}
              </Link>
            </li>
            <li>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <Link
                href="/flights"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {t("flights.title")}
              </Link>
            </li>
            <li>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-gray-900 font-semibold">
              {t("flights.results.breadcrumb")}
            </li>
          </ol>
        </nav>

        {/* Enhanced Header with Journey Summary - Clickable to Convert to Search */}
        {isSearchMode ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t("flights.search.modify_search")}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToSearch}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {isRTL ? (
                    <FaLongArrowAltRight className="w-4 h-4" />
                  ) : (
                    <FaLongArrowAltLeft className="w-4 h-4" />
                  )}
                  <span>
                    {t("flights.search.back_to_main_search", {
                      defaultValue: "Back to Search",
                    })}
                  </span>
                </button>
                <button
                  onClick={handleSearchModeToggle}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {t("common.close")}
                  </span>
                </button>
              </div>
            </div>
            <SearchBar onSubmit={handleSearchSubmit} />
          </div>
        ) : (
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-blue-200"
            onClick={handleSearchModeToggle}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-3 sm:mb-4 lg:mb-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 sm:mb-3">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center space-x-2 gap-2 mb-2 sm:mb-0">
                    <span className="truncate">{originLabel}</span>
                    {language === "en" ? (
                      <FaLongArrowAltRight className="flex-shrink-0" />
                    ) : (
                      <FaLongArrowAltLeft className="flex-shrink-0" />
                    )}
                    <span className="truncate">{destinationLabel}</span>
                  </h1>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-blue-600 hidden sm:inline">
                      {t("flights.search.click_to_modify")}
                    </span>
                    <span className="text-xs font-medium text-blue-600 sm:hidden">
                      {t("common.edit")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 lg:gap-4 text-gray-600 text-xs sm:text-sm">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg
                      className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium truncate">
                      {isRoundTrip ? (
                        <>
                          {new Date(startDate).toLocaleDateString(dateLocale, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          {endDate && (
                            <>
                              {" • "}

                              {new Date(endDate).toLocaleDateString(
                                dateLocale,
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        new Date(startDate).toLocaleDateString(dateLocale, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg
                      className="w-3 h-3 sm:w-5 sm:h-5 text-green-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {adults}{" "}
                      {adults == 1
                        ? t("flights.passengers.adult")
                        : t("flights.passengers.adults")}
                      {children > 0 &&
                        `, ${children} ${
                          children == 1
                            ? t("flights.passengers.child")
                            : t("flights.passengers.children")
                        }`}
                      {infants > 0 &&
                        `, ${infants} ${
                          infants == 1
                            ? t("flights.passengers.infant")
                            : t("flights.passengers.infants")
                        }`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg
                      className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="font-medium">
                      {getCabinClassLabel(cabinClass)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3 mt-3 sm:mt-0">
                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-500">
                    {t("flight_results.total_passengers")}
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                    {parseInt(adults) + parseInt(children) + parseInt(infants)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filters trigger */}
        <div className="xl:hidden mb-3">
          <button
            type="button"
            onClick={() => setShowFiltersSheet(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 4 21 4 14 12 14 20 10 18 10 12 3 4"></polygon>
            </svg>
            {t("filters.title")}
          </button>
        </div>

        {/* Main Content with Filters and Results Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1 hidden xl:block">
            <div className="sticky top-4 sm:top-6 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)] overflow-y-auto pb-4 sm:pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {isLoading ? (
                <SearchFiltersSkeleton />
              ) : (
                <SearchFilters
                  airlinesOptions={
                    airlineOptions && airlineOptions.length > 0
                      ? airlineOptions
                      : []
                  }
                  onFilterChange={onFilterChange}
                  onSortChange={onSortChange}
                  currentSortBy={sortBy}
                  currency={currency}
                />
              )}
            </div>
          </div>

          <div className="xl:col-span-3 order-1 xl:order-2">
            {isLoading ? (
              <FlightResultsSkeleton />
            ) : (
              <FlightResults
                results={results}
                origin={origin}
                destination={destination}
                date={date}
                adults={adults}
                childrenCount={children}
                infants={infants}
                cabinClass={cabinClass}
                tripType={tripType}
                isLoading={isLoading}
                isInitialLoad={isInitialLoad}
                isSearching={isSearching}
                isFiltering={isFiltering}
                totalFlightsFound={totalFlightsFound}
                onLoadMore={onLoadMore}
                canLoadMore={canLoadMore}
                currency={currency}
              />
            )}
          </div>
        </div>

        {/* Mobile Bottom Sheet for Filters */}
        {showFiltersSheet && (
          <div className="xl:hidden">
            <div
              className="fixed inset-0 z-[10001] bg-black/40"
              onClick={() => setShowFiltersSheet(false)}
            />
            <div className="fixed inset-x-0 bottom-0 z-[10002] max-h-[85vh] overflow-hidden">
              <div className="mx-auto w-full bg-white rounded-t-2xl shadow-xl">
                <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 rounded-t-2xl">
                  <div className="font-semibold text-gray-900">
                    {t("filters.title")}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFiltersSheet(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    aria-label={t("common.close", { defaultValue: "Close" })}
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="p-4 max-h-[75vh] overflow-y-auto">
                  {isLoading ? (
                    <SearchFiltersSkeleton />
                  ) : (
                    <SearchFilters
                      airlinesOptions={
                        airlineOptions && airlineOptions.length > 0
                          ? airlineOptions
                          : []
                      }
                      onFilterChange={(f) => {
                        onFilterChange(f);
                      }}
                      onSortChange={(s) => {
                        onSortChange(s);
                      }}
                      currentSortBy={sortBy}
                      currency={currency}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
