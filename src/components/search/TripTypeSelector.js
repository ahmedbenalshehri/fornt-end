"use client";

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useSearchForm } from "../../context/SearchFormContext";
import { LuArrowRight, LuArrowLeftRight } from "react-icons/lu";

const TripTypeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0;
  width: 100%;
`;

const TripTypeOptions = styled.div`
  display: flex;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  width: 100%;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TripTypeOption = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isSelected",
})`
  flex: 1;
  padding: 16px 12px;
  border: none;
  background: ${(props) => (props.isSelected ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.isSelected ? "white" : "#4b5563")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  min-height: 56px;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 28px;
    background: ${(props) => (props.isSelected ? "transparent" : "#e5e7eb")};
    transition: all 0.3s ease;
  }

  &:hover {
    background: ${(props) => (props.isSelected ? "#1d4ed8" : "#f8fafc")};
    color: ${(props) => (props.isSelected ? "white" : "#1f2937")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    position: relative;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }

  svg {
    width: 18px;
    height: 18px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  @media (min-width: 640px) {
    padding: 16px 16px;
    font-size: 15px;
    gap: 10px;

    svg {
      width: 19px; /* Slightly reduced from 20px */
      height: 19px;
    }
  }

  @media (min-width: 768px) {
    min-height: 58px; /* Reduced from 60px */
    padding: 16px 18px; /* Reduced from 18px 20px */

    &:not(:last-child)::after {
      height: 30px; /* Reduced from 32px */
    }
  }

  @media (min-width: 1024px) {
    min-height: 60px; /* Reduced from 64px */
    padding: 18px 20px; /* Reduced from 20px 24px */
    font-size: 15px; /* Reduced from 16px */

    svg {
      width: 20px; /* Reduced from 22px */
      height: 20px;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    padding: 14px 8px;
    gap: 6px;
    font-size: 13px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  /* RTL Support */
  .rtl & {
    flex-direction: row-reverse;

    &:not(:last-child)::after {
      right: auto;
      left: 0;
    }
  }
`;

const TripTypeOptionText = styled.span`
  transition: all 0.3s ease;
  font-weight: inherit;

  @media (max-width: 380px) {
    display: none;
  }
`;

const TripTypeOptionTextMobile = styled.span`
  display: none;
  font-weight: inherit;

  @media (max-width: 380px) {
    display: block;
    font-size: 11px;
    text-align: center;
    line-height: 1.2;
  }
`;

export default function TripTypeSelector() {
  const { t } = useTranslation();
  const { state, actions } = useSearchForm();
  const { tripType } = state;
  const { setTripType } = actions;

  const handleTripTypeChange = (type) => {
    setTripType(type);
  };

  const tripTypes = [
    {
      value: "oneway",
      label: t("flights.trip_type.one_way"),
      shortLabel: t("flights.trip_type.one_way_short") || "One Way",
      icon: <LuArrowRight />,
    },
    {
      value: "roundtrip",
      label: t("flights.trip_type.round_trip"),
      shortLabel: t("flights.trip_type.round_trip_short") || "Round Trip",
      icon: <LuArrowLeftRight />,
    },
  ];

  return (
    <TripTypeContainer>
      <TripTypeOptions
        role="radiogroup"
        aria-label={t("flights.trip_type.label") || "Trip Type"}
        id="trip-type-selector"
      >
        {tripTypes.map((type) => (
          <TripTypeOption
            key={type.value}
            type="button"
            role="radio"
            aria-checked={tripType === type.value}
            aria-label={type.label}
            isSelected={tripType === type.value}
            onClick={() => handleTripTypeChange(type.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleTripTypeChange(type.value);
              }
            }}
          >
            {type.icon}
            <TripTypeOptionText>{type.label}</TripTypeOptionText>
            <TripTypeOptionTextMobile>
              {type.shortLabel}
            </TripTypeOptionTextMobile>
          </TripTypeOption>
        ))}
      </TripTypeOptions>
    </TripTypeContainer>
  );
}
