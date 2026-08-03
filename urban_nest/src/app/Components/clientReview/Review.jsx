import React from "react";
import SectionHeader from "../SectionHeader";
import ReviewCard from "./ReviewCard";
import { clientReviews } from "@/app/assets/assets";

const Review = () => {
  return (
    <section className="p-space-9 gap-space-7 flex flex-col items-center w-[1440px] container mx-auto">
        <SectionHeader mainText={'reviews'} text={'Real Client'} />
        <div className="flex gap-space-4 overflow-x-scroll w-full scrollBar">
          {clientReviews.map((item) => (
            <ReviewCard key={item.id} clientInfo={item.client} clientProperty={item.property} content={item.quote} rating={item.rating} aiRecommended={item.aiRecommended} detailsLink={item.detailsLink} />
          ))}
          
        </div>
    </section>
  );
};

export default Review;
