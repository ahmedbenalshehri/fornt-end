import HeroSection from "@/components/package/HeroSection";
import InclusionsSection from "@/components/package/InclusionsSection";
import NavigationActivation from "@/components/package/NavigationActivation";
import OverviewSection from "@/components/package/OverviewSection";
import PackageClient from "@/components/package/PackageClient";
import { getOfferById } from "@/services/apiOffers";

// Generate dynamic metadata based on the offer data
export async function generateMetadata({ params }) {
  const { slug } = params;
  const offer = await getOfferById(slug, "ar");

  // Format the date for metadata
  const createdDate = offer?._createdAt
    ? new Date(offer._createdAt).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return {
    title: offer?.titleHeader?.ar || "فلاي مون - رفيقك في السفر",
    description:
      offer?.overview?.ar ||
      "احجز الرحلات والفنادق واكتشف الأماكن الرائعة مع فلاي مون",
    openGraph: {
      title: offer?.titleHeader?.ar || "فلاي مون - رفيقك في السفر",
      description:
        offer?.overview?.ar ||
        "احجز الرحلات والفنادق واكتشف الأماكن الرائعة مع فلاي مون",
      type: "article",
      publishedTime: offer?._createdAt,
      modifiedTime: offer?._updatedAt,
    },
    other: {
      "article:published_time": offer?._createdAt,
      "article:modified_time": offer?._updatedAt,
      date: createdDate,
    },
    alternates: {
      canonical: `/package/${slug}`,
    },
  };
}

export default async function page({ params }) {
  const { slug } = params;
  const result = await getOfferById(slug, "ar");

  console.log(result);

  return (
    <div className="min-h-screen">
      <HeroSection offer={result} />
      {/* <NavigationActivation result={result} />a */}

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            <OverviewSection offer={result} />
            <InclusionsSection tripFeatures={result?.inclusions} />
          </div>

          {/* Client Component with Modal State */}
          <PackageClient offer={result} />
        </div>
      </div>
    </div>
  );
}
