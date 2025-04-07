import React from "react";
import WhyChooseUs from "./components/WhyChooseUs";
import Hero from "./components/Hero";
import WhatAreWeLooking from "./components/WhatAreWeLooking";
import WhyJoinUs from "./components/WhyJoinUs";
import Journey from "./components/Journey";
import FAQ from "./components/FAQ";

const JoinUs: React.FC = () => {
  return (
    <div className="bg-black text-white font-sans">
      {/* Hero Section */}
      <Hero />
      {/* Why Choose Fractional Work */}
      <WhyChooseUs />
      {/* What Are We Looking For */}
      <WhatAreWeLooking />
      {/* Why Join Us */}
      <WhyJoinUs />
      {/* Every Masterpiece Begins */}
      <Journey />
      {/* FAQs Section */}
      <FAQ />
    </div>
  );
};

export default JoinUs;
