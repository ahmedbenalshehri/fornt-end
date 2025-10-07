"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCalendar } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useSearchForm } from "../../context/SearchFormContext";
import Calendar from "./Calendar";

const formatDateLocalized = (date, locale) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString(locale || "ar", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (_) {
    return new Date(date).toLocaleDateString("ar", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
};

// Custom hook to detect mobile screen
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

export default function DateInput({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const { t, i18n } = useTranslation();
  const { state, actions } = useSearchForm();
  const { showCalendar, tripType } = state;
  const { setShowCalendar, setTripType } = actions;
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Escape key to close calendar
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showCalendar) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCalendar, setShowCalendar]);

  // Handle clicks outside calendar for mobile
  useEffect(() => {
    if (!isMobile || !showCalendar) return;

    const handleClickOutside = (event) => {
      const calendarElement = document.querySelector('[data-calendar="true"]');
      const dateInputElement = event.target.closest('[data-date-input="true"]');

      if (
        calendarElement &&
        !calendarElement.contains(event.target) &&
        !dateInputElement
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, showCalendar, setShowCalendar]);

  const handleDateClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleAddReturnClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the main date click
    setTripType("roundtrip"); // Convert to round-trip
    setShowCalendar(true); // Open calendar for return date selection
  };

  // Prevent body scroll when mobile calendar is open
  useEffect(() => {
    if (isMobile && showCalendar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, showCalendar]);

  return (
    <div className="relative w-full" data-date-input="true">
      <div
        className="flex w-full rounded-lg overflow-hidden bg-white cursor-pointer hover:border-orange-300 transition-colors  border-gray-200"
        onClick={handleDateClick}
        dir="rtl"
        role="button"
        tabIndex={0}
        aria-label={t(
          "flights.search_form.pick_dates_aria",
          "اختر تواريخ السفر"
        )}
        aria-expanded={showCalendar}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleDateClick();
          }
        }}
      >
        {/* Departure Date */}
        <div className="flex-1 flex items-center py-4 justify-between px-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">
              {t("flights.search_form.departure_date", "تاريخ المغادرة")}
            </span>
            <span className="text-gray-800 text-lg font-medium">
              {startDate
                ? formatDateLocalized(startDate, i18n.language)
                : t("flights.search_form.choose_date", "اختر التاريخ")}
            </span>
          </div>
          <IoCalendar className="text-gray-400 w-6 h-6 ml-2" />
        </div>

        {/* Return Date */}
        <div
          className="flex-1 flex items-center justify-between px-4 py-4 border-r border-gray-200"
          onClick={
            tripType === "oneway" && !endDate ? handleAddReturnClick : undefined
          }
          role={tripType === "oneway" && !endDate ? "button" : undefined}
          tabIndex={tripType === "oneway" && !endDate ? 0 : undefined}
          aria-label={
            tripType === "oneway" && !endDate
              ? t("flights.search_form.add_return", "إضافة تاريخ العودة")
              : undefined
          }
          onKeyDown={
            tripType === "oneway" && !endDate
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAddReturnClick(e);
                  }
                }
              : undefined
          }
        >
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">
              {tripType === "roundtrip" || endDate
                ? t("flights.search_form.return_date", "تاريخ العودة")
                : ""}
            </span>
            <span
              className={`text-lg transition-colors ${
                endDate
                  ? "text-gray-800 font-medium"
                  : tripType === "oneway"
                  ? "text-gray-400 hover:text-orange-500 cursor-pointer"
                  : "text-gray-400"
              }`}
            >
              {endDate
                ? formatDateLocalized(endDate, i18n.language)
                : tripType === "oneway"
                ? t("flights.search_form.add_return", "إضافة العودة")
                : t("flights.search_form.choose_date", "اختر التاريخ")}
            </span>
          </div>
          <IoCalendar className="text-gray-400 w-6 h-6 ml-2" />
        </div>
      </div>

      {/* Calendar Popup - portal on mobile for full-screen */}
      {showCalendar &&
        (!isMobile ? (
          <Calendar
            setShowCalendar={setShowCalendar}
            tripType={tripType}
            setTripType={setTripType}
            isMobile={isMobile}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        ) : (
          isMounted &&
          createPortal(
            <Calendar
              setShowCalendar={setShowCalendar}
              tripType={tripType}
              setTripType={setTripType}
              isMobile={isMobile}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />,
            document.body
          )
        ))}
    </div>
  );
}
