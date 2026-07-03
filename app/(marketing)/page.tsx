import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/HeroSection";

export const metadata: Metadata = {
  title: "Memory Museum — Walk Through the Most Meaningful Moments of Your Life",
  description:
    "An immersive 3D museum built from your photos, videos, journals, and voice recordings. AI-curated exhibits. A living world that grows with you.",
  openGraph: {
    title: "Memory Museum",
    description:
      "An immersive 3D museum built from your photos, videos, journals, and voice recordings.",
    type: "website",
  },
};

export default function HomePage() {
  return <HeroSection />;
}
