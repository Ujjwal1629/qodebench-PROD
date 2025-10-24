import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { FinalCTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
