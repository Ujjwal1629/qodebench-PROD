import { HeroConversion } from "@/components/landing/hero-conversion";
import { ProductModules } from "@/components/landing/product-modules";
import { ValueProposition } from "@/components/landing/value-proposition";
import { SocialProof } from "@/components/landing/social-proof";
import { JourneyAndPricing } from "@/components/landing/journey-and-pricing";
import { FinalCTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Section 1: Conversion-Focused Hero with Lead Form */}
      <HeroConversion />

      {/* Section 2: Product Modules + Learning Path Preview */}
      <ProductModules />

      {/* Section 4: Why + Features (merged) */}
      <ValueProposition />

      {/* Section 5: Stats + Testimonials (merged) */}
      <SocialProof />

      {/* Section 6: Journey + Pricing (side-by-side) */}
      <JourneyAndPricing />

      {/* Section 7: Final CTA */}
      <FinalCTA />

      {/* Section 8: Footer */}
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloat />
    </div>
  );
}
