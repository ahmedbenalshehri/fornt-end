import HeroSection from "@/components/flights/HeroSection";
import FeaturesSection from "@/components/flights/FeaturesSection";
import PartnersSection from "@/components/flights/PartnersSection";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return generatePageMetadata("flights");
}

function FlightsPage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <PartnersSection />
      <FeaturesSection />
    </div>
  );
}

export default FlightsPage;
