import React from "react";
import SectionHeader from "../SectionHeader";
import TrendCard from "./TrendCard";
import FadeUp from "../motions/FadeUp";

const chartData = {
  data1: [30, 38, 35, 42, 48, 45, 52, 58, 55, 62, 68, 65, 74],
  data2: [20, 45, 70, 55, 40, 30, 45, 60, 50, 65, 80, 72, 85],
  data3: [65, 58, 42, 25, 18, 22, 35, 48, 55, 62, 58, 70, 82],
  data4: [40, 62, 35, 58, 30, 55, 25, 50, 45, 68, 40, 75, 60],
};

const Trends = () => {
  return (
    <section className="p-space-9 bg-foreground relative">
      <i className="fi fi-rs-growth-chart-invest text-[350px] absolute top-0 right-0 text-primary-3/10"></i>
      <div className="max-w-[1440px] container mx-auto relative">
        <SectionHeader mainText={"Trends"} text={"Market Insight and"} isDark />
        <div className="flex items-center justify-center gap-space-5 mt-space-7">
          <FadeUp delay={0}>
          <TrendCard
            title="Price Trends"
            changePercent={12.5}
            comparisonLabel="vs Last year"
            data={chartData.data1}
            color={"#2ECC71"}
          /></FadeUp>
          <FadeUp delay={0.2}>
          <TrendCard
            title="Demand Forecast"
            changePercent={400}
            comparisonLabel="vs Last year"
            data={chartData.data2}
            color={"#8B5CF6"}
          /></FadeUp>
          <FadeUp delay={0.4}>
          <TrendCard
            title="Market Stability"
            changePercent={"Strong"}
            percent = {false}
            comparisonLabel="vs Last year"
            data={chartData.data3}
            color={"#F59E0B"}
          /></FadeUp>
          <FadeUp delay={0.6}>
          <TrendCard
            title="Rental Yield"
            changePercent={20}
            comparisonLabel="vs Last year"
            data={chartData.data4}
            color={"#EC4899"}
          /></FadeUp>
        </div>
      </div>
    </section>
  );
};

export default Trends;
