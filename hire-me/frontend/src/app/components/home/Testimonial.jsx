import React from "react";
import HomeHeader from "./HomeHeader";
import TestimonialCard from "./TestimonialCard";
import { getReviews } from "@/lib/fetchData/review";
import HorizontalScroller from "./HorizontalScroller";

const Testimonial = async () => {
  const reviews = await getReviews();
  console.log(reviews[0]);

  if (reviews.length === 0)
    return (
      <p className="px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(3rem,calc(7.273vw+0.545rem),6rem)]">
        No reviews yet.
      </p>
    );

  return (
    // Same structure as the Contact section: the section is full width and
    // clips overflow; the width limit lives only on the inner wrappers.
    <section className="w-full overflow-hidden py-[clamp(3rem,calc(7.273vw+0.545rem),6rem)] space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]">
      <div className="px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] min-w-[320px] max-w-300 mx-auto">
        <HomeHeader
          bg={"#D97706"}
          color={"#D97706"}
          name={"Review"}
          title={"Trusted by Thousands of Professionals"}
        />
      </div>
      <div className="pl-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] min-w-[320px] max-w-300 mx-auto">
        <HorizontalScroller
          label="User Reviews"
          className="gap-[clamp(1.125rem,calc(0.909vw+0.943rem),1.625rem)] py-1 min-w-[320px]"
        >
          {reviews.map((r) => {
            const { id, name, jobTitle, rating, comment, date } = r;

            return (
              <div className="px-1" key={id}>
                <TestimonialCard
                  name={name}
                  jobTitle={jobTitle}
                  rating={rating}
                  comment={comment}
                  date={date}
                />
              </div>
            );
          })}
        </HorizontalScroller>
      </div>
    </section>
  );
};

export default Testimonial;
