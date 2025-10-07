"use client";

import { SearchFormProvider } from "../../context/SearchFormContext";
import PassengerSelector from "./PassengerSelector";
import TripTypeSelector from "./TripTypeSelector";
import DirectFlightSelector from "./DirectFlightSelector";
import CabinClassSelector from "./CabinClassSelector";
import SearchFrom from "./SearchFrom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

export default function SearchBar({ onSubmit }) {
  const { t } = useTranslation();

  return (
    <SearchFormProvider onSubmit={onSubmit}>
      <SearchContainer>
        {/* Enhanced Flight Options Form - Responsive layout */}
        <FlightOptions>
          <FormGroup className="flex">
            <FormLabel>{t("flights.trip_type.label")}</FormLabel>
            <TripTypeSelector />
          </FormGroup>
          <FormGroup className="hidden lg:flex">
            <FormLabel>{t("flights.passengers.label")}</FormLabel>
            <PassengerSelector />
          </FormGroup>
          <FormGroup className="hidden lg:flex">
            <FormLabel>{t("flights.cabin_class.label")}</FormLabel>
            <CabinClassSelector />
          </FormGroup>
          <FormGroup className="hidden lg:flex">
            <FormLabel>{t("flights.direct_flight.label")}</FormLabel>
            <DirectFlightSelector />
          </FormGroup>
        </FlightOptions>

        {/* Enhanced Search Form - Responsive container */}
        <SearchFormContainer>
          <SearchFrom />
        </SearchFormContainer>
      </SearchContainer>
    </SearchFormProvider>
  );
}

const SearchContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 10;

  @media (min-width: 640px) {
    gap: 24px;
  }

  @media (min-width: 1024px) {
    gap: 28px;
  }
`;

const FlightOptions = styled.div`
  display: grid;
  gap: 16px;
  width: 100%;

  /* Mobile: 1 column */
  grid-template-columns: 1fr;

  /* Small tablets: 2 columns */
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  /* Large tablets: 4 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  /* Desktop: 4 columns with controlled spacing */
  @media (min-width: 1024px) {
    gap: 20px;
  }

  /* Large screens: keep spacing reasonable */
  @media (min-width: 1280px) {
    gap: 24px;
  }
`;

const FormGroup = styled.div`
  flex-direction: column;
  gap: 8px;
  min-width: 0; /* Prevents overflow in grid */
  width: 100%;

  @media (min-width: 640px) {
    gap: 10px;
  }
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  display: block;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 13px;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }

  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const SearchFormContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.05);
  padding-top: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);

  &:hover {
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  @media (min-width: 640px) {
    border-radius: 20px;
    padding: 20px 24px;
  }

  @media (min-width: 1024px) {
    border-radius: 24px;
    padding: 24px 28px;
  }
`;
