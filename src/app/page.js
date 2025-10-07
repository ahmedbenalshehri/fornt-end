// app/page.tsx or app/page.js
import Script from "next/script";
import Flights from "./flights/page";

export const metadata = {
  title: "فلاي مون | أفضل عروض باقات السفر وحجز الطيران والفنادق في السعودية",
  description:
    "استكشف أفضل باقات السفر واحجز تذاكر الطيران والفنادق مع فلاي مون بأسعار تنافسية وخدمة موثوقة داخل وخارج المملكة.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "فلاي مون | أفضل عروض باقات السفر وحجز الطيران والفنادق في السعودية",
    description:
      "استكشف أفضل باقات السفر واحجز تذاكر الطيران والفنادق مع فلاي مون بأسعار تنافسية وخدمة موثوقة داخل وخارج المملكة.",
    url: "https://flymoon.sa",
    type: "website",
  },
  twitter: {
    title: "فلاي مون | أفضل عروض باقات السفر وحجز الطيران والفنادق في السعودية",
    description:
      "استكشف أفضل باقات السفر واحجز تذاكر الطيران والفنادق مع فلاي مون بأسعار تنافسية وخدمة موثوقة داخل وخارج المملكة.",
    card: "summary_large_image",
  },
};

export default function Home() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "فلاي مون للسفر والسياحة",
    url: "https://flymoon.sa",
    logo: "https://flymoon.sa/logo.png",
    telephone: "+1234567890",
    address: "مكة المكرمة، المملكة العربية السعودية",
    areaServed: "SA",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "فلاي مون | Flymoon",
    url: "https://flymoon.sa",
    inLanguage: "ar-SA",
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    const travellers = transformToTraveller(
      data,
      travellerRequirements,
      onwardDate
    );
    console.log("travellers", travellers);

    const createBooking = async () => {
      const response = await axios.post(
        "http://localhost:3300/api/flights/create-itinerary",
        {
          TUI: bookingID,
          ServiceEnquiry: "",
          ContactInfo: {
            Title: "",
            FName: "",
            LName: "",
            Mobile: "8590055610",
            DestMob: "8590055610",
            Phone: "",
            Email: "robin@benzyinfotech.com",
            Language: "",
            Address: "MRRA 4  EDAPPALLY  Edappally , EDAPPALLY , Edappally",
            CountryCode: "IN",
            MobileCountryCode: "+91",
            DestMobCountryCode: "+91",
            State: "Kerala",
            City: "Cochin",
            PIN: "6865245",
            GSTCompanyName: "",
            GSTTIN: "",
            GstMobile: "",
            GSTEmail: "",
            UpdateProfile: false,
            IsGuest: false,
            SaveGST: false,
          },
          DestinationContactInfo: {
            Address1: "",
            Address2: "",
            City: "",
            Mobile: "",
            Phone: "",
            Email: "",
            CountryCode: "",
            MobileCountryCode: "+91",
            State: "",
            PIN: "",
          },
          Travellers: travellers,
          PLP: [],
          SSR: null,
          CrossSell: [],
          CrossSellAmount: 0,
          EnableFareMasking: false,
          SSRAmount: 0,

          DeviceID: "",
          AppVersion: "",
          AgentTourCode: "",
          NetAmount: amount,
          BRulesAccepted: "",
        }
      );
      console.log("response", response.data);
    };
    createBooking();
  };

  return (
    <>
      <Script
        id="org-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(organizationJsonLd)}
      </Script>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(websiteJsonLd)}
      </Script>

      <Flights />
    </>
  );
}
