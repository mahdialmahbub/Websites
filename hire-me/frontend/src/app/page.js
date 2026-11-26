import React from "react";
import Hero from "./components/home/Hero";
import Steps from "./components/home/Steps";
import Templetes from "./components/home/Templetes";
import Testimonial from "./components/home/Testimonial";
import Contact from "./components/home/Contact";
import FinalCTA from "./components/home/FinalCTA";
import FAQ from "./components/home/FAQ";
import ATSScore from "./components/home/ATS/ATSScore";
import { canonical } from "@/lib/seo/canonical";

export const metadata = {
  alternates: { canonical: canonical("/") },
};

const page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center *:w-full">
      <Hero />
      <Steps />
      <Templetes />
      <ATSScore />
      <Testimonial />
      <Contact />
      <FAQ />
      <FinalCTA />
    </main>
  );
};

export default page;
