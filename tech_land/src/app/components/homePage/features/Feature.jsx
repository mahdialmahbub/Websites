import React from "react";
import SectionHeader from "../SectionHeader";
import { featureCardInfo } from "@/app/assets/assets";
import FeatureCard from "./FeatureCard";

const Feature = () => {
  return (
    <section className="section">
      <SectionHeader
        type="withSubtitle"
        title={"Why Choice us"}
        subtitle={
          "Creating homes you love with thoughtful, stylish, and practical products."
        }
      />
      <div className="grid grid-cols-2 gap-space-6">
        {featureCardInfo.map((item) => (
          <FeatureCard
            key={item.id}
            img={item.image}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Feature;
