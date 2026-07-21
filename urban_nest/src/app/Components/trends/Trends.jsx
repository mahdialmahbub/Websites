import React from "react";
import SectionHeader from "../SectionHeader";
import TrendCard from "./TrendCard";

const Trends = () => {
  return (
    <section className="p-space-9 bg-foreground">
      <div className="">
        <SectionHeader mainText={"Trends"} text={"Market Insight and"} isDark />
        <div className="flex items-center gap-space-5 mt-space-7">
          <TrendCard
            title="Price Trends"
            changePercent={12.5}
            comparisonLabel="vs Last year"
            data={[20, 45, 70, 55, 40, 30, 45, 60, 50, 65, 80, 72, 85]}
          />
          <TrendCard
            title="Price Trends"
            changePercent={12.5}
            comparisonLabel="vs Last year"
            data={[20, 45, 70, 55, 40, 30, 45, 60, 50, 65, 80, 72, 85]}
            color={"#8B5CF6"}
          />
          <TrendCard
            title="Price Trends"
            changePercent={"bal"}
            comparisonLabel="vs Last year"
            data={[20, 45, 70, 55, 40, 30, 45, 60, 50, 65, 80, 72, 85]}
                        color={"#8B5CF6"}

          />
          <TrendCard
            title="Price Trends"
            changePercent={12.5}
            comparisonLabel="vs Last year"
            data={[20, 45, 70, 55, 40, 30, 45, 60, 50, 65, 80, 72, 85]}
                        color={"#8B5CF6"}

          />
        </div>
      </div>
    </section>
  );
};

export default Trends;
