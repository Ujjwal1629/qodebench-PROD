import { Hero } from "@/components/landing/hero";
import { ProductModules } from "@/components/landing/product-modules";
import { WhyQodebench } from "@/components/landing/why-qodebench";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { FinalCTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ProductModules />
      <WhyQodebench />
      <Stats />
      <Features />
      <Testimonials />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
