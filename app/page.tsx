import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { PlatformPreview } from "@/components/landing/platform-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ComingSoon } from "@/components/landing/coming-soon";
import { Pricing } from "@/components/landing/pricing";
import { FinalCTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <Features />
      <PlatformPreview />
      <HowItWorks />
      <ComingSoon />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
