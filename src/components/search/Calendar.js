"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import styled from "styled-components";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const Calendar = ({
  setShowCalendar,
  isMobile = false,
  tripType,
  setTripType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const { t, i18n } = useTranslation();
  const [viewDate, setViewDate] = useState(new Date());
  const calendarRef = useRef(null);

  // Create today's date once and ensure it's at midnight for consistent comparison
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Localized day names (RTL order: Saturday to Friday). Fallback to Arabic sequence
  const daysNarrow = useMemo(() => {
    try {
      const base = new Date(2024, 5, 1); // arbitrary Saturday (June 1, 2024 is Saturday)
      const result = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        result.push(
          new Intl.DateTimeFormat(i18n.language || "ar", {
            weekday: "narrow",
          }).format(d)
        );
      }
      return result; // Sat..Fri
    } catch (_) {
      return ["س", "ج", "خ", "أ", "ث", "ا", "ح"];
    }
  }, [i18n.language]);

  // Close calendar when clicking outside (only for desktop)
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event) => {
      // Improved click outside detection - check for calendar data attribute
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        !event.target.closest('[data-calendar="true"]')
      ) {
        setShowCalendar(false);
      }
    };

    // Use capture to handle the event before it bubbles
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [setShowCalendar, isMobile]);

  // Prevent body scroll when mobile calendar is open
  useEffect(() => {
    if (isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobile]);

  // Improved safe date utility with better error handling
  const safeDate = useCallback((date) => {
    if (!date) return null;

    try {
      const parsedDate = date instanceof Date ? new Date(date) : new Date(date);

      // Check if date is valid
      if (isNaN(parsedDate.getTime())) return null;

      // Create a clean date without time component
      const cleanDate = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate()
      );
      cleanDate.setHours(0, 0, 0, 0);
      return cleanDate;
    } catch (error) {
      console.warn("Invalid date provided:", date);
      return null;
    }
  }, []);

  // Improved calendar generation with better edge case handling
  const generateCalendar = useCallback((year, month) => {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    // Start from the beginning of the week containing the first day
    const startDate = new Date(year, month, 1 - startDay);
    let currentDate = new Date(startDate);

    // Generate exactly 6 weeks for consistent layout
    for (let week = 0; week < 6; week++) {
      const weekDates = [];
      for (let day = 0; day < 7; day++) {
        weekDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(weekDates);
    }

    return weeks;
  }, []);

  // Improved date comparison functions
  const isSameDate = useCallback(
    (d1, d2) => {
      const date1 = safeDate(d1);
      const date2 = safeDate(d2);

      if (!date1 || !date2) return false;

      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    },
    [safeDate]
  );

  const isDateInPast = useCallback(
    (date) => {
      const compareDate = safeDate(date);
      if (!compareDate) return false;
      return compareDate < today;
    },
    [safeDate, today]
  );

  const isInRange = useCallback(
    (date) => {
      const safeSelectedDate = safeDate(date);
      const safeStartDate = safeDate(startDate);
      const safeEndDate = safeDate(endDate);

      if (!safeSelectedDate || !safeStartDate || !safeEndDate) return false;

      const selectedTime = safeSelectedDate.getTime();
      const startTime = safeStartDate.getTime();
      const endTime = safeEndDate.getTime();

      return selectedTime > startTime && selectedTime < endTime;
    },
    [safeDate, startDate, endDate]
  );

  // Improved date selection logic with better validation
  const handleDateSelect = useCallback(
    (date) => {
      const safeSelectedDate = safeDate(date);
      if (!safeSelectedDate || isDateInPast(safeSelectedDate)) {
        return;
      }

      const cleanDate = new Date(safeSelectedDate);
      cleanDate.setHours(0, 0, 0, 0);

      if (tripType === "roundtrip") {
        if (!startDate || (startDate && endDate)) {
          // First selection or reselecting both dates
          setStartDate(cleanDate);
          setEndDate(null);
        } else if (startDate && !endDate) {
          // Second selection for end date
          const safeStartDate = safeDate(startDate);

          if (cleanDate.getTime() >= safeStartDate.getTime()) {
            setEndDate(cleanDate);
            setShowCalendar(false);
          } else {
            // If selected date is before start date, swap them
            setEndDate(startDate);
            setStartDate(cleanDate);
            setShowCalendar(false);
          }
        }
      } else if (tripType === "oneway") {
        setStartDate(cleanDate);
        setEndDate(null);
        setShowCalendar(false);
      }
    },
    [
      safeDate,
      isDateInPast,
      tripType,
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      setShowCalendar,
    ]
  );

  // Navigation handlers with boundary checks
  const handlePrev = useCallback(() => {
    const prevDate = new Date(viewDate);
    prevDate.setMonth(prevDate.getMonth() - 1);

    // Don't allow going before current month
    const minViewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prevDate >= minViewDate) {
      setViewDate(prevDate);
    }
  }, [viewDate, today]);

  const handleNext = useCallback(() => {
    const nextDate = new Date(viewDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    // Optional: Add max date limit (e.g., 2 years from now)
    const maxViewDate = new Date(today.getFullYear() + 2, today.getMonth(), 1);
    if (nextDate <= maxViewDate) {
      setViewDate(nextDate);
    }
  }, [viewDate, today]);

  // Memoized calendar grids for better performance
  const currentGrid = useMemo(
    () => generateCalendar(viewDate.getFullYear(), viewDate.getMonth()),
    [generateCalendar, viewDate]
  );

  const nextGrid = useMemo(
    () =>
      !isMobile
        ? generateCalendar(viewDate.getFullYear(), viewDate.getMonth() + 1)
        : null,
    [generateCalendar, viewDate, isMobile]
  );

  // Localized month and year
  const formatMonthYear = useCallback(
    (date) => {
      try {
        return new Intl.DateTimeFormat(i18n.language || "ar", {
          month: "long",
          year: "numeric",
        }).format(date);
      } catch (_) {
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
      }
    },
    [i18n.language]
  );

  // Convert to Arabic numerals
  const toArabicNumerals = useCallback((num) => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicNumerals[digit] || digit)
      .join("");
  }, []);

  // Determine which grids to show
  const gridsToShow = useMemo(
    () => (isMobile ? [currentGrid] : [currentGrid, nextGrid]),
    [isMobile, currentGrid, nextGrid]
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && <Backdrop onClick={() => setShowCalendar(false)} />}

      <CalendarContainer
        ref={calendarRef}
        $isMobile={isMobile}
        data-calendar="true"
      >
        {/* Header with close button for mobile */}
        {isMobile && (
          <MobileHeader>
            <CloseButton onClick={() => setShowCalendar(false)}>
              <IoClose />
            </CloseButton>
            <MobileTitle>{t("calendar.title", "اختيار التاريخ")}</MobileTitle>
          </MobileHeader>
        )}

        <ContentWrapper $isMobile={isMobile}>
          <Header $isMobile={isMobile}>
            <TripTypeSelector>
              <TripOption
                $isMobile={isMobile}
                $isActive={tripType === "oneway"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTripType("oneway");
                  setEndDate(null);
                }}
              >
                {t("flights.trip_type.one_way", "ذهاب فقط")}
              </TripOption>
              <TripOption
                $isMobile={isMobile}
                $isActive={tripType === "roundtrip"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTripType("roundtrip");
                }}
              >
                {t("flights.trip_type.round_trip", "ذهاب وعودة")}
              </TripOption>
            </TripTypeSelector>
          </Header>

          <MonthsWrapper $isMobile={isMobile}>
            {gridsToShow.map((grid, idx) => {
              if (!grid) return null;

              const displayedDate = new Date(viewDate);
              displayedDate.setMonth(viewDate.getMonth() + idx);

              return (
                <MonthSection
                  key={`${displayedDate.getFullYear()}-${displayedDate.getMonth()}`}
                  $isMobile={isMobile}
                >
                  <MonthTitle $isMobile={isMobile}>
                    {(idx === 0 || isMobile) && (
                      <Arrow
                        $isMobile={isMobile}
                        onClick={handlePrev}
                        disabled={
                          viewDate.getFullYear() === today.getFullYear() &&
                          viewDate.getMonth() === today.getMonth()
                        }
                        aria-label={t(
                          "calendar.prev_month_aria",
                          "الشهر السابق"
                        )}
                      >
                        <IoIosArrowForward />
                      </Arrow>
                    )}
                    <MonthName>{formatMonthYear(displayedDate)}</MonthName>
                    {((!isMobile && idx === 1) || isMobile) && (
                      <Arrow
                        $isMobile={isMobile}
                        onClick={handleNext}
                        aria-label={t(
                          "calendar.next_month_aria",
                          "الشهر التالي"
                        )}
                      >
                        <IoIosArrowBack />
                      </Arrow>
                    )}
                  </MonthTitle>

                  <CalendarGrid $isMobile={isMobile}>
                    {daysNarrow.map((day, index) => (
                      <DayHeader key={index} $isMobile={isMobile}>
                        {day}
                      </DayHeader>
                    ))}

                    {grid.flat().map((date, index) => {
                      const isDisplayMonth =
                        date.getMonth() === displayedDate.getMonth() &&
                        date.getFullYear() === displayedDate.getFullYear();

                      let disabled = !isDisplayMonth || isDateInPast(date);

                      // When selecting return date, disable dates before startDate
                      if (tripType === "roundtrip" && startDate && !endDate) {
                        const safeStartDate = safeDate(startDate);
                        if (safeStartDate && date < safeStartDate) {
                          disabled = true;
                        }
                      }

                      const isSelected =
                        isSameDate(date, startDate) ||
                        isSameDate(date, endDate);
                      const inRange = isInRange(date);
                      const isToday = isSameDate(date, today);
                      const isStartDate = isSameDate(date, startDate);
                      const isEndDate = isSameDate(date, endDate);

                      return (
                        <DayCell
                          key={`${date.getFullYear()}-${date.getMonth()}-${index}`}
                          disabled={disabled}
                          $isSelected={isSelected}
                          $isInRange={inRange}
                          $isStartDate={isStartDate}
                          $isEndDate={isEndDate}
                          $isToday={isToday}
                          $isMobile={isMobile}
                          onClick={() => !disabled && handleDateSelect(date)}
                          role="button"
                          tabIndex={disabled ? -1 : 0}
                          aria-label={`${toArabicNumerals(
                            date.getDate()
                          )} ${formatMonthYear(date)}`}
                          onKeyDown={(e) => {
                            if (
                              (e.key === "Enter" || e.key === " ") &&
                              !disabled
                            ) {
                              e.preventDefault();
                              handleDateSelect(date);
                            }
                          }}
                        >
                          {toArabicNumerals(date.getDate())}
                        </DayCell>
                      );
                    })}
                  </CalendarGrid>
                </MonthSection>
              );
            })}
          </MonthsWrapper>

          {tripType === "roundtrip" && startDate && !endDate && (
            <HelpText $isMobile={isMobile}>
              {t("calendar.select_return_help", "الرجاء اختيار تاريخ العودة")}
            </HelpText>
          )}
        </ContentWrapper>

        {/* Done button for mobile */}
        {isMobile && (
          <MobileDoneButton onClick={() => setShowCalendar(false)}>
            {t("calendar.done", "تم")}
          </MobileDoneButton>
        )}
      </CalendarContainer>
    </>
  );
};

// Responsive breakpoints
const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
};

// Styled Components with improved responsiveness and RTL support
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px);
  z-index: 999;
  touch-action: none;
`;

const CalendarContainer = styled.div`
  background-color: white;
  font-family: "Arial", sans-serif;
  direction: rtl;
  display: flex;
  flex-direction: column;
  z-index: 1000;

  ${({ $isMobile }) =>
    $isMobile
      ? `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100dvh;
        overflow: hidden;
        border-radius: 0;
        box-shadow: none;
      `
      : `
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        width: min(680px, 85vw);
        border-radius: 12px;
        border: 1px solid #e1e5e9;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        animation: dropdownIn 0.2s ease-out;
        padding: 20px;

        @media (min-width: ${breakpoints.large}) {
          width: min(750px, 80vw);
          padding: 24px;
        }

        @media (max-width: ${breakpoints.desktop}) {
          width: min(620px, 90vw);
          padding: 18px;
        }

        @media (max-width: ${breakpoints.tablet}) {
          width: min(480px, 92vw);
          padding: 14px;
        }

        @media (max-width: ${breakpoints.mobile}) {
          width: 95vw;
          padding: 12px;
        }
      `}

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes dropdownIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 16px 12px;
  position: relative;
  border-radius: 0;
  border-bottom: 1px solid #e9ecef;
`;

const MobileTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
  text-align: center;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 18px;
  color: #6c757d;
  border-radius: 10px;
  transition: all 0.15s ease;
  position: absolute;
  right: 16px;

  &:hover {
    background-color: #e9ecef;
    color: #495057;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $isMobile }) => ($isMobile ? "0" : "0")};

  ${({ $isMobile }) =>
    $isMobile &&
    `
    &::-webkit-scrollbar {
      width: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #e9ecef;
      border-radius: 2px;
    }
  `}
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "16px")};
  padding: ${({ $isMobile }) => ($isMobile ? "0 16px" : "0")};

  @media (min-width: ${breakpoints.large}) {
    margin-bottom: 20px;
  }
`;

const Arrow = styled.button`
  font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "20px")};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ $isMobile }) => ($isMobile ? "8px" : "8px")};
  border-radius: 50%;
  transition: all 0.15s ease;
  color: #1a73e8;
  min-width: ${({ $isMobile }) => ($isMobile ? "36px" : "36px")};
  min-height: ${({ $isMobile }) => ($isMobile ? "36px" : "36px")};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${breakpoints.large}) {
    font-size: 22px;
    min-width: 40px;
    min-height: 40px;
    padding: 10px;
  }

  &:hover:not(:disabled) {
    background-color: #e8f0fe;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    background-color: #d2e3fc;
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const MonthsWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "1fr" : "repeat(2, 1fr)"};
  gap: ${({ $isMobile }) => ($isMobile ? "4px" : "20px")};
  padding: ${({ $isMobile }) => ($isMobile ? "0" : "0")};

  @media (min-width: ${breakpoints.large}) {
    gap: 28px;
  }

  @media (max-width: ${breakpoints.desktop}) {
    gap: 18px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const MonthSection = styled.div`
  background: white;
`;

const MonthTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "16px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "17px")};
  font-weight: 600;
  color: #1a1f36;
  gap: 12px;

  @media (min-width: ${breakpoints.large}) {
    font-size: 18px;
    margin-bottom: 18px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

const MonthName = styled.span`
  font-family: "Arial", sans-serif;
  flex: 1;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "4px" : "3px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "8px" : "0")};

  @media (min-width: ${breakpoints.large}) {
    gap: 4px;
  }
`;

const DayHeader = styled.div`
  padding: ${({ $isMobile }) => ($isMobile ? "8px 2px" : "8px 2px")};
  text-align: center;
  font-weight: 600;
  color: #6c757d;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "12px")};

  @media (min-width: ${breakpoints.large}) {
    font-size: 13px;
    padding: 10px 2px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 10px;
    padding: 6px 2px;
  }
`;

const DayCell = styled.div`
  padding: ${({ $isMobile }) => ($isMobile ? "6px" : "8px")};
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ $isSelected, $isInRange, disabled, $isToday }) => {
    if (disabled) return "#ced4da";
    if ($isSelected || $isInRange) return "#fff";
    if ($isToday) return "#1a73e8";
    return "#1a1f36";
  }};
  background-color: ${({
    $isSelected,
    $isInRange,
    $isStartDate,
    $isEndDate,
    disabled,
  }) => {
    if ($isSelected && !disabled) {
      if ($isStartDate || $isEndDate) return "#1a73e8";
      return "#1a73e8";
    }
    if ($isInRange && !disabled) return "#4285f4";
    return "transparent";
  }};
  border-radius: ${({ $isStartDate, $isEndDate, $isMobile }) => {
    if ($isStartDate) return "0 50% 50% 0";
    if ($isEndDate) return "50% 0 0 50%";
    return $isMobile ? "8px" : "6px";
  }};
  font-weight: ${({ $isSelected, $isToday }) =>
    $isSelected || $isToday ? "600" : "500"};
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "14px")};
  transition: all 0.15s ease;
  border: ${({ $isToday, $isSelected }) =>
    $isToday && !$isSelected ? "1px solid #1a73e8" : "none"};
  min-height: ${({ $isMobile }) => ($isMobile ? "54px" : "38px")};
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;

  @media (min-width: ${breakpoints.large}) {
    font-size: 15px;
    min-height: 42px;
    padding: 10px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    min-height: 36px;
  }

  &:hover:not([disabled]) {
    background-color: ${({ $isSelected, $isInRange }) =>
      $isSelected || $isInRange ? "#1557b0" : "#f8f9fa"};
    transform: ${({ $isMobile }) =>
      $isMobile ? "scale(1.05)" : "scale(1.03)"};
  }

  &:active:not([disabled]) {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid #1a73e8;
    outline-offset: 1px;
  }

  /* Friday highlighting */
  &:nth-child(7n-1) {
    color: ${({ disabled, $isSelected, $isInRange, $isToday }) =>
      disabled
        ? "#ced4da"
        : $isSelected || $isInRange
        ? "#fff"
        : $isToday
        ? "#1a73e8"
        : "#dc3545"};
  }
`;

const TripTypeSelector = styled.div`
  display: flex;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

const TripOption = styled.button`
  padding: ${({ $isMobile }) => ($isMobile ? "8px 16px" : "6px 14px")};
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "13px")};
  background-color: ${({ $isActive }) =>
    $isActive ? "#1a73e8" : "transparent"};
  color: ${({ $isActive }) => ($isActive ? "#fff" : "#6c757d")};
  cursor: pointer;
  transition: all 0.15s ease;
  outline: none;
  user-select: none;
  white-space: nowrap;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    padding: 6px 12px;
  }

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? "#1557b0" : "rgba(26, 115, 232, 0.08)"};
    color: ${({ $isActive }) => ($isActive ? "#fff" : "#1a73e8")};
  }

  &:focus-visible {
    outline: 2px solid #1a73e8;
    outline-offset: 1px;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const HelpText = styled.div`
  text-align: center;
  color: #dc3545;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "13px")};
  font-weight: 500;
  background: #fff5f5;
  border-radius: 6px;
  padding: 8px 16px;
  margin: 12px 16px 0;
  border: 1px solid #fecaca;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    padding: 6px 12px;
    margin: 10px 16px 0;
  }
`;

const MobileDoneButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
  position: relative;
  overflow: hidden;
  border-top: 1px solid #e9ecef;

  &:hover {
    background: linear-gradient(135deg, #1557b0 0%, #3367d6 100%);
    transform: translateY(-1px);
  }

  &:active {
    background: linear-gradient(135deg, #1045a0 0%, #2851b4 100%);
    transform: translateY(0);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.4s;
  }

  &:hover:before {
    left: 100%;
  }
`;

export default Calendar;
