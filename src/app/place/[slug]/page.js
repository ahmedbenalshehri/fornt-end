import HeroSection from "@/components/place/HeroSection";
import OfferGrid from "@/components/place/OfferGrid";
import { getDestinationById } from "@/services/apiOffers";

export default async function page({ params }) {
  const { slug } = params;
  const { destination, offers } = await getDestinationById(slug, "ar");

  console.log(destination, offers);

  return (
    <div>
      <HeroSection place={destination} />
      <OfferGrid offers={offers} />
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const result = await getDestinationById(slug, "ar");

  const destinationTitle = result?.destination?.title;
  const bannerTitle = result?.destination?.image__banner?.title;
  const descriptionFallback =
    bannerTitle || "اكتشف الوجهات السياحية الرائعة مع فلاي مون";
  const baseTitle = "فلاي مون - رفيقك في السفر";
  const title = destinationTitle
    ? `${destinationTitle} | ${baseTitle}`
    : baseTitle;

  return {
    title,
    description: descriptionFallback,
    alternates: {
      canonical: `/place/${slug}`,
    },
    openGraph: {
      title,
      description: descriptionFallback,
      type: "website",
      locale: "ar",
    },
    twitter: {
      title,
      description: descriptionFallback,
      card: "summary_large_image",
    },
  };
}
