import React from "react";
import { useTranslation } from "react-i18next";
import {
  BsCalendar,
  BsClock,
  BsGeoAlt,
  BsAirplane,
  BsPerson,
  BsCreditCard,
  BsTelephone,
  BsEnvelope,
} from "react-icons/bs";
export default function PriceCard({ pricingData, priceError }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <BsCreditCard className="w-6 h-6 mr-2 text-green-600" />
        {t("flight_details.pricing_details")}
      </h3>
      <div className="space-y-3">
        {/* Base Fare */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("flight_details.base_fare")}</span>
          <span className="font-medium">
            {pricingData.currency} {pricingData.baseFare}
          </span>
        </div>

        {/* Taxes */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("flight_details.taxes")}</span>
          <span className="font-medium">
            {pricingData.currency} {pricingData.taxes}
          </span>
        </div>

        {/* Transaction Fee */}
        {pricingData.transactionFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t("flight_details.transaction_fee")}
            </span>
            <span className="font-medium">
              {pricingData.currency} {pricingData.transactionFee}
            </span>
          </div>
        )}

        {/* VAT on Transaction Fee */}
        {pricingData.vatOnTransactionFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t("flight_details.vat_on_transaction_fee")}
            </span>
            <span className="font-medium">
              {pricingData.currency} {pricingData.vatOnTransactionFee}
            </span>
          </div>
        )}

        {/* Discounts */}
        {pricingData.discounts > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{t("flight_details.discounts")}</span>
            <span className="font-medium">
              -{pricingData.currency} {pricingData.discounts}
            </span>
          </div>
        )}

        {/* Additional Services */}
        <div className="border-t border-gray-200 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              {t("flight_details.baggage_allowance")}
            </span>
            <span className="text-gray-600">{pricingData.baggage}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              {t("flight_details.seat_selection")}
            </span>
            <span className="text-gray-600">{pricingData.seatSelection}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">{t("flight_details.meal")}</span>
            <span className="text-gray-600">{pricingData.meal}</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>{t("flight_details.total")}</span>
            <span className="text-green-600">
              {pricingData.currency} {pricingData.total}
            </span>
          </div>
        </div>

        {priceError && (
          <div className="text-center py-2">
            <span className="text-xs text-red-500">
              {t("flight_details.price_verification_failed")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
