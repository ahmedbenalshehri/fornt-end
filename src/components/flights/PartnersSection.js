"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { HiCheckBadge, HiStar } from "react-icons/hi2";
import flynasSrc from "../../assets/airlines/Flynas.png";
import saudiaSrc from "../../assets/airlines/saudiArabian.png";
import qatarSrc from "../../assets/airlines/qatar.png";
import kiwaitSrc from "../../assets/airlines/KuwaitAirways.png";
import emiratesSrc from "../../assets/airlines/emirates.png";
import egyptSrc from "../../assets/airlines/EgyptAir.png";
import TurkishSrc from "../../assets/airlines/TurkishAirlines.png";
import Image from "next/image";

const airlines = [
  {
    name: "Flynas",
    logo: flynasSrc,
    verified: true,
    rating: 4.2,
  },
  {
    name: "Saudi Arabian Airlines",
    logo: saudiaSrc,
    verified: true,
    rating: 4.5,
  },
  {
    name: "Qatar Airways",
    logo: qatarSrc,
    verified: true,
    rating: 4.8,
  },
  {
    name: "Kuwait Airways",
    logo: kiwaitSrc,
    verified: true,
    rating: 4.1,
  },
  {
    name: "Emirates",
    logo: emiratesSrc,
    verified: true,
    rating: 4.7,
  },
  {
    name: "EgyptAir",
    logo: egyptSrc,
    verified: true,
    rating: 4.0,
  },
  {
    name: "Turkish Airlines",
    logo: TurkishSrc,
    verified: true,
    rating: 4.6,
  },
];

export default function PartnersSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-700 text-sm font-semibold border border-green-200/50 mb-6">
            <HiCheckBadge className="w-4 h-4 text-green-500" />
            {t("flights.partners.title")}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("flights.partners.subtitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("flights.partners.description")}
          </p>
        </div>

        {/* Airlines Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 lg:gap-6">
          {airlines.map((airline, index) => (
            <div
              key={airline.name}
              className="group relative bg-white rounded-2xl p-4 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Verified badge */}
              {airline.verified && (
                <div className="absolute -top-2 -right-2 z-0">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <HiCheckBadge className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Logo container */}
              <div className="flex flex-col items-center justify-between h-full space-y-3">
                <div className="flex items-center justify-center w-full h-16 mb-2">
                  <Image
                    src={airline.logo}
                    alt={`${airline.name} logo`}
                    className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                    width={80}
                    height={80}
                    priority={index < 4}
                  />
                </div>

                {/* Airline name */}
                <h3 className="text-sm font-medium text-gray-800 text-center line-clamp-2 mb-1">
                  {airline.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-600">
                    {airline.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600">
            {t("flights.partners.footer_text")}
          </p>
        </div>
      </div>
    </section>
  );
}
