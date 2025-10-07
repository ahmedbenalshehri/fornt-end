"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { locationSearch } from "../../services/apiPlanes";
import { LuPlaneTakeoff, LuX, LuMapPin } from "react-icons/lu";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";

// Styled Components
const StyledInput = styled.div`
  width: 100%;
  border-radius: 7px;
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  && svg {
    width: 24px;
    height: 24px;
    color: #9ca3af;
  }
`;

const Input = styled.input`
  border: none;
  height: 56px;
  width: 100%;
  color: #1f2937;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  background: #f8fafc;
  transition: all 0.3s ease;

  &:focus {
    border: none;
    outline: none;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    background: #f1f5f9;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const Label = styled.label`
  color: #374151;
  font-size: ${(props) => (props.isFloating ? "12px" : "14px")};
  font-weight: 600;
  position: absolute;
  top: ${(props) => (props.isFloating ? "-12px" : "-24px")};
  left: ${(props) => (props.isFloating ? "16px" : "8px")};
  background: white;
  padding: 0 6px;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  border-radius: 4px;

  /* RTL Support */
  [dir="rtl"] & {
    left: auto;
    right: ${(props) => (props.isFloating ? "16px" : "8px")};
  }
`;

const Suggestions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 320px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 8px;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  &.active {
    opacity: 1;
    transform: translateY(4px);
    pointer-events: auto;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
    border-radius: 3px;
    transition: background 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    }
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

// Mobile Bottom Sheet Components
const BottomSheetOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10005;
  display: ${(props) => (props.$show ? "block" : "none")};
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: opacity 0.3s ease;
  visibility: ${(props) => (props.$show ? "visible" : "hidden")};

  @media (min-width: 768px) {
    display: none;
  }
`;

const BottomSheet = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 0;
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.3);
  z-index: 10006;
  transform: ${(props) => (props.$show ? "translateY(0)" : "translateY(100%)")};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 100vh; /* Full screen height */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  visibility: ${(props) => (props.$show ? "visible" : "hidden")};

  @media (min-width: 768px) {
    display: none;
  }
`;

const BottomSheetHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const BottomSheetTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
`;

const BottomSheetContent = styled.div`
  padding: 0;
  flex: 1;
  overflow-y: auto;
`;

const MobileSearchInput = styled.input`
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  background: white;

  &:focus {
    outline: none;
    border-bottom-color: #3b82f6;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const MobileSuggestionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NoResults = styled.div`
  padding: 40px 24px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

const SuggestionItem = styled.li`
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  margin-bottom: 4px;
  position: relative;
  border: 1px solid transparent;

  &:hover {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-color: #bae6fd;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(56, 189, 248, 0.15);
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }

  &:focus {
    outline: none;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* RTL Support */
  [dir="rtl"] &:hover {
    transform: translateX(-4px);
  }

  [dir="rtl"] &:active {
    transform: translateX(-2px) scale(0.98);
  }

  @media (max-width: 767px) {
    padding: 18px 24px;
    margin-bottom: 0;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #f3f4f6;
    transform: none;

    &:hover {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      transform: none;
      box-shadow: none;
    }

    &:last-child {
      border-bottom: none;
    }

    [dir="rtl"] &:hover {
      transform: none;
    }
  }
`;

// Component
export default function LocationInput({
  label,
  inputValue,
  setInputValue,
  icon,
  title,
  onChange,
  onRemove,
  location,
  className,
}) {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const inputRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const hasValue =
    (inputValue && inputValue.trim().length > 0) ||
    (location && location.trim().length > 0);
  const showSuggestions = filteredLocations.length > 0;

  // Detect mount and mobile screen size
  useEffect(() => {
    setIsMounted(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Fetch matching locations (Desktop)
  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue?.(value);
    onRemove();
    onChange(value);
    if (value.trim()) {
      const results = await locationSearch(value, "ar-AE");
      setFilteredLocations(results || []);
    } else {
      setFilteredLocations([]);
    }
  };

  // Handle mobile search input
  const handleMobileSearch = async (e) => {
    const value = e.target.value;
    setMobileSearchValue(value);
    if (value.trim()) {
      const results = await locationSearch(value, "ar-AE");
      setFilteredLocations(results || []);
    } else {
      setFilteredLocations([]);
    }
  };

  // Handle mobile input click
  const handleMobileInputClick = () => {
    if (isMobile) {
      setShowMobilePopup(true);
      setMobileSearchValue("");
      setFilteredLocations([]);
      // Focus on mobile search input after popup opens
      setTimeout(() => {
        if (mobileSearchRef.current) {
          mobileSearchRef.current.focus();
        }
      }, 300); // Increased timeout to ensure popup is fully rendered
    }
  };

  // Select suggestion
  const handleSelect = (location) => {
    onChange(`${location.name} (${location.code})`);
    setFilteredLocations([]);
    if (isMobile) {
      setShowMobilePopup(false);
      setMobileSearchValue("");
    }
  };

  // Handle overlay click (mobile)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setFilteredLocations([]);
      setShowMobilePopup(false);
      setMobileSearchValue("");
    }
  };

  // Close suggestions
  const closeSuggestions = () => {
    setFilteredLocations([]);
    setIsFocused(false);
    if (isMobile) {
      setShowMobilePopup(false);
      setMobileSearchValue("");
    }
  };

  // Detect click outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !isMobile
      ) {
        setFilteredLocations([]);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isMobile && showMobilePopup) {
          setFilteredLocations([]);
          setIsFocused(false);
          setShowMobilePopup(false);
          setMobileSearchValue("");
        } else if (!isMobile && showSuggestions) {
          setFilteredLocations([]);
          setIsFocused(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, showMobilePopup, showSuggestions]);

  // Prevent body scroll when bottom sheet is open (mobile)
  useEffect(() => {
    if (showMobilePopup && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobilePopup, isMobile]);

  return (
    <>
      <StyledInput ref={inputRef} className={""}>
        <InputWrapper>
          {!hasValue && icon}
          <Input
            id="location-input"
            type="text"
            placeholder={title}
            value={location}
            onChange={isMobile ? undefined : handleChange}
            onClick={isMobile ? handleMobileInputClick : undefined}
            onFocus={
              isMobile
                ? handleMobileInputClick
                : (e) => {
                    e.target.select();
                    setIsFocused(true);
                  }
            }
            onBlur={isMobile ? undefined : () => setIsFocused(false)}
            readOnly={isMobile}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="location-suggestions"
            style={isMobile ? { cursor: "pointer" } : {}}
          />
        </InputWrapper>

        {/* Desktop Suggestions Dropdown */}
        {showSuggestions && !isMobile && (
          <Suggestions id="location-suggestions" className="active">
            {filteredLocations.map((loc) => (
              <SuggestionItem key={loc.id} onClick={() => handleSelect(loc)}>
                <LocationOption location={loc} />
              </SuggestionItem>
            ))}
          </Suggestions>
        )}
      </StyledInput>

      {/* Mobile Bottom Sheet via Portal - full screen */}
      {isMounted &&
        isMobile &&
        showMobilePopup &&
        createPortal(
          <>
            <BottomSheetOverlay
              $show={showMobilePopup}
              onClick={handleOverlayClick}
            />
            <BottomSheet $show={showMobilePopup}>
              <BottomSheetHeader>
                <BottomSheetTitle>
                  {title ||
                    t("flights.search_form.select_location", "Select Location")}
                </BottomSheetTitle>
                <CloseButton onClick={closeSuggestions}>
                  <LuX />
                </CloseButton>
              </BottomSheetHeader>
              <BottomSheetContent>
                <MobileSearchInput
                  ref={mobileSearchRef}
                  type="text"
                  placeholder={t("flights.search_form.search_city_airport")}
                  value={mobileSearchValue}
                  onChange={handleMobileSearch}
                  autoComplete="off"
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {filteredLocations.length > 0 ? (
                  <MobileSuggestionsList>
                    {filteredLocations.map((loc) => (
                      <SuggestionItem
                        key={loc.id}
                        onClick={() => handleSelect(loc)}
                      >
                        <LocationOption location={loc} />
                      </SuggestionItem>
                    ))}
                  </MobileSuggestionsList>
                ) : mobileSearchValue.trim() ? (
                  <NoResults>
                    {t("common.no_results_for", {
                      query: mobileSearchValue,
                      defaultValue: "No results found for “{{query}}”",
                    })}
                  </NoResults>
                ) : (
                  <NoResults>{t("flights.search_form.start_typing")}</NoResults>
                )}
              </BottomSheetContent>
            </BottomSheet>
          </>,
          document.body
        )}
    </>
  );
}

// Suggestion Display
const LocationOption = React.memo(({ location }) => {
  const { isRTL } = useLanguage();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flex: 1,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LuMapPin
            style={{
              width: "18px",
              height: "18px",
              color: "#0ea5e9",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            flex: 1,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          <p
            style={{
              color: "#1f2937",
              fontSize: "15px",
              fontWeight: "600",
              margin: "0",
              lineHeight: "1.3",
            }}
          >
            {location.name}
          </p>
          <span
            style={{
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "400",
              lineHeight: "1.2",
            }}
          >
            {location.country.name}
          </span>
        </div>
      </div>
      {location.code && (
        <span
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "white",
            padding: "6px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.25)",
            minWidth: "fit-content",
            letterSpacing: "0.5px",
          }}
        >
          {location.code}
        </span>
      )}
    </div>
  );
});

LocationOption.displayName = "LocationOption";
