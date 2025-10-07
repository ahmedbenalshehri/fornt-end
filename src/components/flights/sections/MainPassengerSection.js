import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Section,
  SectionTitle,
  GenderToggle,
  GenderButton,
  InputGrid,
  InputGroup,
  ErrorMessage,
  CheckboxGroup,
  CheckboxLabel,
} from "../styles/PassengerForm.styles";
import FormInput from "../../FormInput";
import DateSelect from "../../DateSelect";
import SearchableSelect from "../../SearchableSelect";

const GenderToggleComponent = ({ value, onChange, t }) => (
  <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
    <legend className="sr-only">{t("passenger_form.gender.title")}</legend>
    <GenderToggle>
      <GenderButton
        type="button"
        $active={value === "Mr"}
        onClick={() => onChange("Mr")}
        aria-pressed={value === "Mr"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
        {t("passenger_form.gender.mr")}
      </GenderButton>
      <GenderButton
        type="button"
        $active={value === "Mrs"}
        onClick={() => onChange("Mrs")}
        aria-pressed={value === "Mrs"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <path d="M12 13v8" />
          <path d="M8 17h8" />
        </svg>
        {t("passenger_form.gender.mrs")}
      </GenderButton>
    </GenderToggle>
  </fieldset>
);

const RequiredLabel = ({ labelKey, isRequired, isRTL, t }) => (
  <label
    style={{
      direction: isRTL ? "rtl" : "ltr",
      textAlign: isRTL ? "right" : "left",
    }}
  >
    {isRTL && isRequired && (
      <span style={{ color: "#3d4fff", marginRight: "4px" }}>*</span>
    )}
    {t(labelKey)}
    {!isRTL && isRequired && (
      <span style={{ color: "#3d4fff", marginLeft: "4px" }}>*</span>
    )}
  </label>
);

export default function MainPassengerSection({
  control,
  errors,
  travellerRequirements,
  nationalityOptions,
  countryOptions,
  createValidationRules,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Section>
      <SectionTitle>
        <span>{t("passenger_form.main_passenger")}</span>
        <span>{t("passenger_form.adult", { count: 1 })}</span>
      </SectionTitle>

      <Controller
        name="gender"
        control={control}
        render={({ field: { value, onChange } }) => (
          <GenderToggleComponent value={value} onChange={onChange} t={t} />
        )}
      />

      <InputGrid>
        <Controller
          name="name"
          control={control}
          rules={{ required: t("passenger_form.fields.name_required") }}
          render={({ field }) => (
            <FormInput
              {...field}
              label={t("passenger_form.fields.name")}
              placeholder={t("passenger_form.fields.name_placeholder")}
              error={errors.name?.message}
              required
            />
          )}
        />
        <Controller
          name="surname"
          control={control}
          rules={{ required: t("passenger_form.fields.surname_required") }}
          render={({ field }) => (
            <FormInput
              {...field}
              label={t("passenger_form.fields.surname")}
              placeholder={t("passenger_form.fields.surname_placeholder")}
              error={errors.surname?.message}
              required
            />
          )}
        />
      </InputGrid>

      <InputGrid>
        {travellerRequirements.nationality?.required && (
          <InputGroup>
            <Controller
              name="nationality"
              control={control}
              rules={createValidationRules("nationality", true)}
              render={({ field }) => (
                <>
                  <RequiredLabel
                    labelKey="passenger_form.fields.nationality"
                    isRequired={true}
                    isRTL={isRTL}
                    t={t}
                  />
                  <SearchableSelect
                    options={nationalityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t(
                      "passenger_form.fields.nationality_placeholder"
                    )}
                    searchPlaceholder={t("common.search", "Search...")}
                    error={!!errors.nationality}
                    t={t}
                    isRTL={isRTL}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  />
                  {errors.nationality && (
                    <ErrorMessage>{errors.nationality.message}</ErrorMessage>
                  )}
                </>
              )}
            />
          </InputGroup>
        )}
        {travellerRequirements.dateOfBirth?.required && (
          <InputGroup>
            <Controller
              name="birthDate"
              control={control}
              rules={createValidationRules("date_of_birth", true)}
              render={({ field: { value, onChange } }) => (
                <DateSelect
                  label={t("passenger_form.fields.date_of_birth")}
                  dayValue={value?.day || ""}
                  monthValue={value?.month || ""}
                  yearValue={value?.year || ""}
                  onDayChange={(day) => onChange({ ...value, day })}
                  onMonthChange={(month) => onChange({ ...value, month })}
                  onYearChange={(year) => onChange({ ...value, year })}
                  error={errors.birthDate?.message}
                  required
                />
              )}
            />
          </InputGroup>
        )}
      </InputGrid>

      <InputGrid>
        {travellerRequirements.passportNumber?.required && (
          <Controller
            name="passportNumber"
            control={control}
            rules={createValidationRules("passport_number", true)}
            render={({ field }) => (
              <FormInput
                {...field}
                label={t("passenger_form.fields.passport_number")}
                placeholder={t(
                  "passenger_form.fields.passport_number_placeholder"
                )}
                error={errors.passportNumber?.message}
                required
              />
            )}
          />
        )}
        {travellerRequirements.passportExpiry?.required && (
          <InputGroup>
            <Controller
              name="passportExpDate"
              control={control}
              rules={{
                required: t("passenger_form.fields.passport_expiry_required"),
                validate: (value) => {
                  if (!value?.day || !value?.month || !value?.year) {
                    return true;
                  }

                  const day = parseInt(value.day, 10);
                  const month = parseInt(value.month, 10);
                  const year = parseInt(value.year, 10);

                  if (isNaN(day) || isNaN(month) || isNaN(year)) {
                    return true;
                  }

                  const passportExpDate = new Date(year, month - 1, day);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (passportExpDate <= today) {
                    return t(
                      "passenger_form.fields.passport_expiry_must_be_future"
                    );
                  }

                  return true;
                },
              }}
              render={({ field: { value, onChange } }) => (
                <DateSelect
                  label={t("passenger_form.fields.passport_expiry")}
                  dayValue={value?.day || ""}
                  monthValue={value?.month || ""}
                  yearValue={value?.year || ""}
                  onDayChange={(day) => onChange({ ...value, day })}
                  onMonthChange={(month) => onChange({ ...value, month })}
                  onYearChange={(year) => onChange({ ...value, year })}
                  error={errors.passportExpDate?.message}
                  required
                  yearRange="future"
                />
              )}
            />
          </InputGroup>
        )}
      </InputGrid>

      <InputGrid>
        {travellerRequirements.passportIssue?.required && (
          <InputGroup>
            <Controller
              name="passportIssueLocation"
              control={control}
              rules={{
                required: t(
                  "passenger_form.fields.passport_issue_location_required"
                ),
              }}
              render={({ field }) => (
                <>
                  <RequiredLabel
                    labelKey="passenger_form.fields.passport_issue_location"
                    isRequired={true}
                    isRTL={isRTL}
                    t={t}
                  />
                  <SearchableSelect
                    options={nationalityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t(
                      "passenger_form.fields.passport_issue_location_placeholder"
                    )}
                    searchPlaceholder={t("common.search", "Search...")}
                    error={!!errors.passportIssueLocation}
                    t={t}
                    isRTL={isRTL}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  />
                  {errors.passportIssueLocation && (
                    <ErrorMessage>
                      {errors.passportIssueLocation.message}
                    </ErrorMessage>
                  )}
                </>
              )}
            />
          </InputGroup>
        )}
        {travellerRequirements.passportIssueDate?.required && (
          <InputGroup>
            <Controller
              name="passportIssueDate"
              control={control}
              rules={{
                required: t(
                  "passenger_form.fields.passport_issue_date_required"
                ),
              }}
              render={({ field: { value, onChange } }) => (
                <DateSelect
                  label={t("passenger_form.fields.passport_issue_date")}
                  dayValue={value?.day || ""}
                  monthValue={value?.month || ""}
                  yearValue={value?.year || ""}
                  onDayChange={(day) => onChange({ ...value, day })}
                  onMonthChange={(month) => onChange({ ...value, month })}
                  onYearChange={(year) => onChange({ ...value, year })}
                  error={errors.passportIssueDate?.message}
                  required
                />
              )}
            />
          </InputGroup>
        )}
      </InputGrid>

      <InputGrid>
        {travellerRequirements.country?.required && (
          <InputGroup>
            <Controller
              name="country"
              control={control}
              rules={createValidationRules("country", true)}
              render={({ field }) => (
                <>
                  <RequiredLabel
                    labelKey="passenger_form.fields.country"
                    isRequired={true}
                    isRTL={isRTL}
                    t={t}
                  />
                  <SearchableSelect
                    options={countryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("passenger_form.fields.country_placeholder")}
                    searchPlaceholder={t("common.search", "Search...")}
                    error={!!errors.country}
                    t={t}
                    isRTL={isRTL}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  />
                  {errors.country && (
                    <ErrorMessage>{errors.country.message}</ErrorMessage>
                  )}
                </>
              )}
            />
          </InputGroup>
        )}
        {travellerRequirements.panNumber?.required && (
          <Controller
            name="panNumber"
            control={control}
            rules={createValidationRules("pan_number", true)}
            render={({ field }) => (
              <FormInput
                {...field}
                label={t("passenger_form.fields.pan_number")}
                placeholder={t("passenger_form.fields.pan_number_placeholder")}
                error={errors.panNumber?.message}
                required
              />
            )}
          />
        )}
      </InputGrid>

      {travellerRequirements.emigrationCheck?.required && (
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend className="sr-only">
            {t("passenger_form.fields.emigration_check")}
          </legend>
          <InputGrid>
            <Controller
              name="emigrationCheck"
              control={control}
              rules={{
                required: t("passenger_form.fields.emigration_check_required"),
              }}
              render={({ field }) => (
                <CheckboxGroup style={{ direction: isRTL ? "rtl" : "ltr" }}>
                  <CheckboxLabel
                    style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                  >
                    <input
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      style={{
                        marginLeft: isRTL ? "8px" : "0",
                        marginRight: isRTL ? "0" : "8px",
                        width: "44px",
                        height: "44px",
                      }}
                      aria-describedby={
                        errors.emigrationCheck ? "emigration-error" : undefined
                      }
                    />
                    <span>{t("passenger_form.fields.emigration_check")}</span>
                  </CheckboxLabel>
                  {errors.emigrationCheck && (
                    <ErrorMessage id="emigration-error">
                      {errors.emigrationCheck.message}
                    </ErrorMessage>
                  )}
                </CheckboxGroup>
              )}
            />
          </InputGrid>
        </fieldset>
      )}
    </Section>
  );
}
