import { generatePageMetadata } from "@/utils/metadata";
import HotelsPageClient from "@/components/hotels/HotelsPageClient";

export async function generateMetadata() {
  return generatePageMetadata("hotels");
}

export default function HotelsPage() {
  return <HotelsPageClient />;
}
