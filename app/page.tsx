import { Hero } from "@/components/landing/v2/hero";
import { VideoSection } from "@/components/landing/v2/video-section";
import { Courses } from "@/components/landing/v2/courses";
import { Testimonials } from "@/components/landing/v2/testimonials";
import { StayConnected } from "@/components/landing/v2/stay-connected";
import { SubscribePopup } from "@/components/landing/v2/subscribe-popup";
import { Footer } from "@/components/landing/v2/footer";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* What this is, in one screen */}
      <Hero />

      {/* Course walkthrough video */}
      <VideoSection />

      {/* Courses with curriculum inside each card */}
      <Courses />

      {/* Learner stories */}
      <Testimonials />

      {/* Newsletter + WhatsApp channel */}
      <StayConnected />

      <Footer />

      <WhatsAppFloat />

      {/* Newsletter/WhatsApp popup for logged-out first-time visitors */}
      <SubscribePopup />
    </div>
  );
}
