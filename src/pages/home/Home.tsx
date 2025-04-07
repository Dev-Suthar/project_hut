import { useState } from "react";
import PartnerLoveSection from "./components/Aboutus";
import IntegratedSections from "./components/EnhancedIntegratedSections";
import FAQSection from "./components/FAQSection";
import GetInTouchSection from "./components/GetInTouchSection";
import Hero from "./components/Hero";
import HowWeWorkSection from "./components/HowWeWorkSection";
import ScrollingBanner from "./components/ScrollingBanner";
import ServicesDetailSection from "./components/ServicesDetailSection";
import ServiceSection from "./components/ServiceSection";
import TenXSection from "./components/TenXSection";
import TrustedCompaniesSection from "./components/TrustedCompaniesSection";
import PricingModal from "./components/PricingModal";
import ModernFooter from "components/ModernFooter";

const HomePage = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);

  // Open modal function - just toggle visibility
  const openPricingModal = () => {
    setIsPricingModalOpen(true);
    document.body.classList.add("modal-open");
  };

  // Close modal function
  const closePricingModal = () => {
    setIsPricingModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  return (
    <>
      <Hero />
      <ScrollingBanner />
      <TenXSection />
      <ServiceSection />
      <HowWeWorkSection />
      <ServicesDetailSection />
      <IntegratedSections onOpenPricingModal={openPricingModal} />
      <TrustedCompaniesSection />
      <PartnerLoveSection />
      <GetInTouchSection />
      <FAQSection />
      {isPricingModalOpen && (
        <PricingModal closePricingModal={closePricingModal} />
      )}
      <ModernFooter />
    </>
  );
};

export default HomePage;
