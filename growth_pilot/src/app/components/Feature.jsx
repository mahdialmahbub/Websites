import React from "react";

import SectionHeading from "./SectionHeading";
import FeatureCard from "./FeatureCard";
import FadeUp from "./motions/FadeUp";

const Feature = () => {
  const features = [
    {
      title: "Smart Marketing Automation",
      subtitle:
        "Automatically run campaigns, emails, and workflows without manual effort.",
      icon: "fi fi-sr-user-robot",
      color: "#6C5CE7",
      bgColor: "#F3F0FF",
    },

    {
      title: "Real-time Analytics Dashboard",
      subtitle:
        "Track performance, conversions, and user behavior in real time.",
      icon: "fi fi-sr-chart-pie-alt",
      color: "#56CCF2",
      bgColor: "#EAF6FF",
    },

    {
      title: "Easy Integrations",
      subtitle:
        "Connect with your favorite tools like CRM, email, and payment systems.",
      icon: "fi fi-sr-user-link",
      color: "#F59E0B",
      bgColor: "#FFF4E6",
    },

    {
      title: "AI-Powered Insights",
      subtitle:
        "Get smart suggestions to improve campaigns and increase conversions.",
      icon: "fi fi-sr-microchip-ai",
      color: "#EC4899",
      bgColor: "#FFF0F6",
    },
  ];

  return (
    <section id="feature" className="section">
      <SectionHeading
        title="Everything You Need to Automate Your Marketing"
        subtitle="Powerful tools designed to save your time, boost conversions, and grow your business — all in one place."
        tagName="Feature"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] xl:gap-[24px]">
        {features.map((feature, i) => (
          <FadeUp key={i} delay={i * 0.3} duration={2}>
          <FeatureCard
            title={feature.title}
            subtitle={feature.subtitle}
            icon={feature.icon}
            color={feature.color}
            bgColor={feature.bgColor}
          /></FadeUp>
        ))}
      </div>
    </section>
  );
};

export default Feature;
