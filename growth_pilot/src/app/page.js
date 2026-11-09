import React from "react";
import Hero from "./components/Hero";
import Scroll from "./components/Scroll";
import Feature from "./components/Feature";
import HowItWork from "./components/HowItWork";
import Benefit from "./components/Benefit";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Testimonial from "./components/Testimonial";

const page = () => {
  return (
    <div>
      <Hero />
      <Scroll />
      <Feature />
      <HowItWork />
      <Benefit />
      <Testimonial />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  );
};

export default page;
