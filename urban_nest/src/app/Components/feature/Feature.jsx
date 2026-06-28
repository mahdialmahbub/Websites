import React from "react";
import SectionHeader from "../SectionHeader";
import FeatureCard from "./FeatureCard";
import { assets } from "@/app/assets/assets";

const Feature = () => {
  return (
    <section className="p-space-9 w-full">
      <div className="w-full ">
        <SectionHeader text={"What makes us"} mainText={"Deferent"} />

        {/* Cards */}
        <div className="flex flex-col items-center gap-space-5 *:w-full">
            {/* Feature 1 */}
            <FeatureCard imageURL={assets.Feature_1} title={'AI Property Match'} subtitle={'Find properties that perfectly match your lifestyle and preferences'} />
            <FeatureCard isRight imageURL={assets.Feature_2} title={'Investment Predictor'} subtitle={'AI predicts future property value and investment potential.'} />
            <FeatureCard imageURL={assets.Feature_3} title={'Smart Location Analysis'} subtitle={'Analysis schools, hospitals, traffic, safety and energyis around any location.'} />
            <FeatureCard isRight imageURL={assets.Feature_4} title={'Price estimator'} subtitle={'Get instant AI-powered property valuation with market insights.'} />
        </div>
      </div>
    </section>
  );
};

export default Feature;
