import React from "react";
import HomeHeader from "./HomeHeader";
import TestimonialCard from "./TestimonialCard";

const Testimonial = () => {
  return (
    <section className="px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(2rem,calc(6.009vw+0.592rem),6rem)] space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]">
      <HomeHeader
        bg={"#D97706"}
        color={"#D97706"}
        name={"Testimonial"}
        title={"Trusted by Thousands of Professionals"}
      />
      <div className="flex">
        <TestimonialCard />
      </div>
    </section>
  );
};

export default Testimonial;
