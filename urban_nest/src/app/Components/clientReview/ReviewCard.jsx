import Image from "next/image";
import React from "react";

const ReviewCard = ({
  content = "Booking was super easy, and the car was spotless and ready right on time. The pickup location was just 5 minutes from my hotel — super convenient!", clientImage = "/images/client-avatar.png",
  clientName = "John Doe",
  clientProfession = "Software Engineer"
}) => {
  return (
    <div className="flex items-center gap-space-4 p-space-5 w-[560px] mb-space-4 border-2 border-primary-3">
      {/* review content, client information, and rating*/}
      <div className="w-full">
        <p className="text-lg font-medium">
          &quot; 
          {content}
          &quot;
        </p>
        <div className="mt-space-4 py-space-3 border-t-2 border-placeholder/20">
        <div className= 'flex items-center gap-space-3'>
          {/* client avatar and name */}
          <Image alt="Client Avatar" src={clientImage} width={100} height={100} className="rounded-full size-[42px]" />
          <div className= "" >
            <h2 className="font-primary font-semibold text-[12px]">{clientName}</h2>
            <p className="font-medium text-[10px]">{clientProfession}</p>
          </div>
        </div>
        {/* Rating */}
        <div className="flex gap-space-4 items-center">
           
        </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
