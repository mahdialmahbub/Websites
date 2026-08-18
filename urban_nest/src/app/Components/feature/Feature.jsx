import React from "react";
import SectionHeader from "../SectionHeader";
import FeatureCard from "./FeatureCard";
import { assets } from "@/app/assets/assets";
import FadeUp from "../motions/FadeUp";

const Feature = () => {
  return (
    <section className="p-space-9 ">
      <div className="w-[1440px] container mx-auto ">
          <SectionHeader text={"What makes us"} mainText={"Deferent"} />

        {/* Cards */}
        <div className="flex flex-col items-center gap-space-5 *:w-full mt-space-7">
          {/* Feature 1 */}
          <FadeUp>
            <FeatureCard
              imageURL={assets.Feature_1}
              title={"AI Property Match"}
              subtitle={
                "Find properties that perfectly match your lifestyle and preferences"
              }
              icon="fi fi-rr-home"
            />
          </FadeUp>
          <FadeUp>
            <FeatureCard
              isRight
              imageURL={assets.Feature_2}
              title={"Investment Predictor"}
              subtitle={
                "AI predicts future property value and investment potential."
              }
              icon="fi fi-rs-growth-chart-invest"
            />
          </FadeUp>
          <FadeUp>
            <FeatureCard
              imageURL={assets.Feature_3}
              title={"Smart Location Analysis"}
              subtitle={
                "Analysis schools, hospitals, traffic, safety and energyis around any location."
              }
              icon="fi fi-rs-marker"
            />
          </FadeUp>
          <FadeUp>
            <FeatureCard
              isRight
              imageURL={assets.Feature_4}
              title={"Price estimator"}
              subtitle={
                "Get instant AI-powered property valuation with market insights."
              }
              icon="fi fi-ss-dollar"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default Feature;
