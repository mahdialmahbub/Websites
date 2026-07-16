import React from "react";
import SectionHeader from "../SectionHeader";
import ReviewCard from "./ReviewCard";

const Review = () => {
  return (
    <section className="p-space-9 gap-space-7 flex flex-col items-center">
        <SectionHeader mainText={'reviews'} text={'Real Client'} />
        <div className="flex gap-space-4 overflow-x-scroll w-full">
          <ReviewCard/>
        </div>
    </section>
  );
};

export default Review;
