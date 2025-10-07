import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Container, SubmitButton } from "./styles/PassengerForm.styles";
import PassengerFormSkeleton from "./PassengerFormSkeleton";
import MainPassengerSection from "./sections/MainPassengerSection";
import ContactDetailsSection from "./sections/ContactDetailsSection";
import SpecialServicesSection from "./sections/SpecialServicesSection";
import ErrorRetrySection from "./sections/ErrorRetrySection";
import { getNationalityOptions, getCountryOptions } from "../../utils/helper";
import useTravelCheckList from "@/hooks/useTravelCheckList";

export default function PassengerForm({
  bookingID,
  flights,
  isLoading,
  onwardDate,
  amount,
  TUI,
  control,
  handleSubmit,
  onSubmit,
  errors,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { loading, error, results, refetch } = useTravelCheckList(bookingID);

  // Memoize static options to prevent unnecessary re-renders
  const nationalityOptions = useMemo(() => getNationalityOptions(t), [t]);
  const countryOptions = useMemo(() => getCountryOptions(t), [t]);

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("checkListData", results);
  }

  // Extract requirements directly from TravellerCheckList
  const travellerCheck = results?.data?.data?.TravellerCheckList?.[0];
  const ssrCheck = results?.data?.data?.SSRCheckList?.Trips?.[0];

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("travellerCheck", travellerCheck);
    console.log("ssrCheck", ssrCheck);
  }

  // Create checklist requirements object with proper structure
  const checkList = {
    travellerRequirements: {
      nationality: { required: travellerCheck?.Nationality === 1 },
      dateOfBirth: { required: travellerCheck?.DOB === 1 },
      passportNumber: { required: travellerCheck?.PassportNo === 1 },
      passportExpiry: { required: travellerCheck?.PDOE === 1 },
      passportIssue: { required: travellerCheck?.PLI === 1 },
      passportIssueDate: { required: travellerCheck?.PDOI === 1 },
      country: { required: travellerCheck?.Country === 1 },
      panNumber: { required: travellerCheck?.PANNo === 1 },
      emigrationCheck: { required: travellerCheck?.EmigCheck === 1 },
    },
    specialServiceRequirements: {
      mealPreference: { required: ssrCheck?.Meal === 1 },
      seatSelection: { required: ssrCheck?.Seat === 1 },
      baggageAllowance: { required: ssrCheck?.Bag === 1 },
    },
  };

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("passenger form", bookingID);
    console.log("checklist results", results);
    console.log("checklist", checkList);
  }

  // Handle loading states
  if (isLoading || loading) {
    return <PassengerFormSkeleton />;
  }

  // Handle error states
  if (error) {
    return <ErrorRetrySection error={error} onRetry={refetch} />;
  }

  // Extract requirements from the checklist structure
  const travellerRequirements = checkList?.travellerRequirements || {};
  const specialServiceRequirements =
    checkList?.specialServiceRequirements || {};

  // Helper function to create validation rules based on checklist requirements
  const createValidationRules = (
    fieldName,
    isRequired,
    customMessage,
    additionalRules = {}
  ) => {
    const rules = {};
    if (isRequired) {
      rules.required =
        customMessage || t(`passenger_form.fields.${fieldName}_required`);
    }

    // Add specific validation rules for different field types
    switch (fieldName) {
      case "email":
        rules.pattern = {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: t("passenger_form.fields.email_invalid"),
        };
        break;
      case "passport_number":
        rules.minLength = {
          value: 6,
          message: t("passenger_form.fields.passport_number_min_length"),
        };
        rules.maxLength = {
          value: 15,
          message: t("passenger_form.fields.passport_number_max_length"),
        };
        break;
      case "pan_number":
        rules.pattern = {
          value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          message: t("passenger_form.fields.pan_number_invalid"),
        };
        break;
      case "phone":
        rules.minLength = {
          value: 7,
          message: t("passenger_form.fields.phone_min_length"),
        };
        rules.maxLength = {
          value: 15,
          message: t("passenger_form.fields.phone_max_length"),
        };
        break;
    }

    // Merge any additional custom rules
    return { ...rules, ...additionalRules };
  };

  // Create a wrapper function to pass travellerRequirements to onSubmit
  const handleFormSubmit = (data) => {
    onSubmit(data, travellerRequirements);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <MainPassengerSection
          control={control}
          errors={errors}
          travellerRequirements={travellerRequirements}
          nationalityOptions={nationalityOptions}
          countryOptions={countryOptions}
          createValidationRules={createValidationRules}
        />

        <SpecialServicesSection
          control={control}
          errors={errors}
          specialServiceRequirements={specialServiceRequirements}
        />

        <ContactDetailsSection
          control={control}
          errors={errors}
          createValidationRules={createValidationRules}
        />

        <SubmitButton
          type="submit"
          style={{ direction: "ltr", textAlign: "center" }}
        >
          {t("passenger_form.continue")}
        </SubmitButton>
      </form>
    </Container>
  );
}
