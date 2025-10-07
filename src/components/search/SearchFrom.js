"use client";

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useSearchForm } from "../../context/SearchFormContext";
import LocationInput from "./LocationInput";
import PassengerSelector from "./PassengerSelector";
import {
  LuPlaneTakeoff,
  LuPlaneLanding,
  LuCalendar,
  LuUsers,
  LuArrowLeftRight,
} from "react-icons/lu";
import DateInput from "./DateInput";
import CabinClassSelector from "./CabinClassSelector";
import DirectFlightSelector from "./DirectFlightSelector";

// Styled Components
const SearchFormContainer = styled.div`
  padding: 0px 0;
  padding-right: 0;
  @media (min-width: 789px) {
    padding: 0px 0;
    border: 1px solid #e5e7eb;
  }
  display: flex;
  flex-direction: column;
  gap: 20px;

  border-radius: 10px;
  background-color: white;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 100px;
  }
`;

const InputGroup = styled.div`
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: block;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 14px;
  }

  @media (min-width: 768px) {
    font-size: 14px; /* Keep same as 640px instead of 15px */
  }

  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const SwapButton = styled.button`
  width: 30px;
  height: 30px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 8px;
  flex-shrink: 0;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: rotate(180deg);
  }

  &:active {
    transform: rotate(180deg) scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: #3b82f6;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;

  @media (min-width: 789px) {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    padding: 0px 32px;
  }
  padding: 10px 32px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  height: 100%;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default function SearchFrom() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isRTL } = useLanguage();
  const { state, actions } = useSearchForm();

  const {
    departure,
    arrival,
    startDate,
    endDate,
    tripType,
    passengers,
    isLoading,
    cabinClass,
    directFlight,
  } = state;

  const {
    setDeparture,
    setArrival,
    setStartDate,
    setEndDate,
    setTripType,
    setLoading,
    isFormValid,
  } = actions;

  const handleDepartureChange = (location) => {
    setDeparture(location);
  };

  const handleArrivalChange = (location) => {
    setArrival(location);
  };

  const handleSwapLocations = () => {
    const tempDeparture = departure;
    setDeparture(arrival);
    setArrival(tempDeparture);
  };

  // Helper function to extract airport code from location string
  const extractAirportCode = (locationString) => {
    if (!locationString) return "";
    const match = locationString.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : locationString;
  };

  const handleSearch = () => {
    if (!isFormValid()) return;

    // Try context-provided submit handler; proceed only if not handled
    const handled = actions.handleSubmit && actions.handleSubmit();
    if (handled) return;

    // Fallback: navigate in same tab
    const { adults, children, infants } = passengers;
    const cabinClassMap = { economy: "E", business: "B", first: "F" };
    const cabinClassParam = cabinClassMap[cabinClass] || "E";

    // Format date - handle both single date and date range for round trips
    let formattedDate = "";
    if (startDate) {
      const startDateFormatted = new Date(startDate)
        .toISOString()
        .split("T")[0];
      if (tripType === "roundtrip" && endDate) {
        // Round trip with return date - use startDate_endDate format
        const endDateFormatted = new Date(endDate).toISOString().split("T")[0];
        formattedDate = `${startDateFormatted}_${endDateFormatted}`;
      } else {
        // One way or round trip without return date
        formattedDate = startDateFormatted;
      }
    }

    const searchParams = new URLSearchParams({
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      cabinClass: cabinClassParam,
    });
    const resultsUrl = `/flights/results/${extractAirportCode(
      departure
    )}/${extractAirportCode(arrival)}/${formattedDate}/${
      directFlight ? "true" : "false"
    }?${searchParams.toString()}`;
    router.push(resultsUrl);
  };

  // Optional: Function to open results in new tab (for advanced users)
  const handleSearchNewTab = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert(t("flights.search_form.please_fill_required_fields"));
      return;
    }

    // Get passenger counts and cabin class from context
    const { adults, children, infants } = passengers;

    // Convert cabin class to URL format (economy -> E, business -> B, first -> F)
    const cabinClassMap = {
      economy: "E",
      business: "B",
      first: "F",
    };
    const cabinClassParam = cabinClassMap[cabinClass] || "E";

    // Format date for URL - handle both single date and date range for round trips
    let formattedDate = "";
    if (startDate) {
      const startDateFormatted = new Date(startDate)
        .toISOString()
        .split("T")[0];
      if (tripType === "roundtrip" && endDate) {
        // Round trip with return date - use startDate_endDate format
        const endDateFormatted = new Date(endDate).toISOString().split("T")[0];
        formattedDate = `${startDateFormatted}_${endDateFormatted}`;
      } else {
        // One way or round trip without return date
        formattedDate = startDateFormatted;
      }
    }

    // Create URL with all parameters
    const searchParams = new URLSearchParams({
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      cabinClass: cabinClassParam,
    });

    // Build the results URL
    const resultsUrl = `/flights/results/${extractAirportCode(
      departure
    )}/${extractAirportCode(arrival)}/${formattedDate}/${
      directFlight ? "true" : "false"
    }?${searchParams.toString()}`;

    // Open in new tab
    window.open(resultsUrl, "_blank");
  };

  const isSearchDisabled = !isFormValid() || isLoading;

  return (
    <SearchFormContainer>
      <FormGrid>
        <InputGroup className="flex lg:flex-row gap-4 px-5 lg:px-0">
          <LocationInput
            title={t("flights.search_form.where_from")}
            icon={<LuPlaneTakeoff />}
            location={departure}
            onChange={handleDepartureChange}
            onRemove={() => setDeparture("")}
          />
          <div className="flex items-center">
            <SwapButton onClick={handleSwapLocations} type="button">
              <LuArrowLeftRight />
            </SwapButton>
          </div>
          <LocationInput
            title={t("flights.search_form.where_to")}
            icon={<LuPlaneLanding />}
            location={arrival}
            onChange={handleArrivalChange}
            onRemove={() => setArrival("")}
          />
        </InputGroup>

        <InputGroup className="border-r border-blue-500/20 pr-1 px-5 lg:px-0">
          <DateInput
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </InputGroup>
        <div className="flex flex-col gap-4 px-4 lg:px-0  lg:hidden">
          <InputGroup className="flex lg:hidden ">
            <FormLabel>{t("flights.passengers.label")}</FormLabel>
            <PassengerSelector />
          </InputGroup>
          <InputGroup className="flex lg:hidden">
            <FormLabel>{t("flights.cabin_class.label")}</FormLabel>
            <CabinClassSelector />
          </InputGroup>
          <InputGroup className="flex lg:hidden">
            <FormLabel>{t("flights.direct_flight.label")}</FormLabel>
            <DirectFlightSelector />
          </InputGroup>
        </div>

        <div className="flex justify-end h-full items-center">
          <SearchButton
            onClick={handleSearch}
            onContextMenu={handleSearchNewTab}
            disabled={isSearchDisabled}
            title="Left click to search, Right click to open in new tab"
          >
            {isLoading
              ? t("flights.search_form.searching")
              : t("flights.search_form.search_button")}
          </SearchButton>
        </div>
      </FormGrid>
    </SearchFormContainer>
  );
}
