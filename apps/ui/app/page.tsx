import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MultichainSection } from "@/components/landing/multichain-section";
import { TrackBanner } from "@/components/landing/pyth-banner";
import { RiskLadderSection } from "@/components/landing/risk-ladder-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="bg-[#070612]">
      <Navbar />
      <Hero />
      <TrackBanner />
      <HowItWorks />
      <RiskLadderSection />
      <MultichainSection />
      <CTASection />
      <Footer />
    </main>
  );
}
