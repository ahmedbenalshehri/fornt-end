import { Almarai, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import StyledComponentsRegistry from "@/lib/registry";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "arial", "sans-serif"],
  preload: true,
  variable: "--font-almarai",
});

export const metadata = {
  metadataBase: new URL("https://flymoon.sa"),
  title: {
    default: "فلاي مون | حجز طيران وفنادق وباقات سفر في السعودية",
    template: "%s | فلاي مون",
  },
  description:
    "فلاي مون وكالة سفر وسياحة سعودية توفر حجز طيران، فنادق وباقات سياحية بأسعار تنافسية وخدمة موثوقة. اكتشف أفضل العروض وسافر بسهولة داخل وخارج المملكة.",
  keywords: [
    // Arabic (primary)
    "وكالة سفر وسياحة في السعودية",
    "وكالة سفر مرخصة",
    "حجز طيران السعودية",
    "تذاكر طيران",
    "رحلات طيران رخيصة",
    "رحلات مباشرة",
    "حجز فنادق السعودية",
    "فنادق الرياض",
    "فنادق جدة",
    "فنادق مكة",
    "عروض سفر السعودية",
    "عروض سياحية السعودية",
    "باقات سفر",
    "باقات سياحية",
    "برامج سياحية",
    "رحلات سياحية عائلية",
    "رحلات شهر العسل",
    "رحلات العمرة",
    "تأشيرات سياحية",
    "تأمين سفر",
    "إيجار سيارات مع سائق",
    "حجوزات سفر",
    "سياحة السعودية",
    "رحلات من الرياض",
    "رحلات من جدة",
    "رحلات من الدمام",
    "رحلات اقتصادية",
    "درجة رجال الأعمال",
    "الدرجة الأولى",
    "أفضل عروض السفر",
    "تنظيم رحلات",
    "حجز منتجعات",
    "عطلات نهاية الأسبوع",
    "سياحة داخلية",
    "سياحة خارجية",
    // Brand
    "فلاي مون",
    "Flymoon",
    // English (supporting)
    "travel agency Saudi Arabia",
    "flight booking Saudi Arabia",
    "cheap flights Saudi Arabia",
    "hotel booking Saudi Arabia",
    "travel packages Saudi Arabia",
  ],
  authors: [{ name: "Flymoon Agency" }],
  creator: "Flymoon Agency",
  publisher: "Flymoon Agency",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "https://flymoon.sa",
    siteName: "فلاي مون | Flymoon",
    title: "فلاي مون | حجز طيران وفنادق وباقات سفر في السعودية",
    description:
      "فلاي مون وكالة سفر وسياحة سعودية توفر حجز طيران، فنادق وباقات سياحية بأسعار تنافسية وخدمة موثوقة. اكتشف أفضل العروض وسافر بسهولة داخل وخارج المملكة.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "فلاي مون - Flymoon Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "فلاي مون | حجز طيران وفنادق وباقات سفر في السعودية",
    description:
      "فلاي مون وكالة سفر وسياحة سعودية توفر حجز طيران، فنادق وباقات سياحية بأسعار تنافسية وخدمة موثوقة. اكتشف أفضل العروض وسافر بسهولة داخل وخارج المملكة.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://flymoon.sa",
    languages: {
      "ar-SA": "https://flymoon.sa/",
      "en-US": "https://flymoon.sa/",
    },
  },
  category: "travel",
  classification: "Travel & Tourism",
  other: {
    "theme-color": "#0066cc",
    "color-scheme": "light",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
      </head>
      <body
        className={` ${almarai.className}  antialiased bg-gray-50 min-h-screen flex flex-col rtl`}
      >
        <StyledComponentsRegistry>
          <LanguageProvider>
            <AuthProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
