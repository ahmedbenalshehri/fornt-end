import Contact from "@/components/about-us/Contact";
import HeroSection from "@/components/about-us/HeroSection";
import Services from "@/components/about-us/Services";
import Vision from "@/components/about-us/Vision";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return generatePageMetadata("about");
}

export default function AboutUs() {
  return (
    <div>
      <HeroSection />
      <Services />
      <Vision />
      {/* Call to Action Section */}
      <Contact />
    </div>
  );
}
