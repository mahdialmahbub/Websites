import { assets } from "@/app/assets/assets";
import Image from "next/image";
import React from "react";

const Marketing = () => {
  return (
    <section className="w-full h-200 flex items-center justify-center relative">
      <Image
        width={1000}
        height={1000}
        src={assets.marketing}
        alt="marketing"
        className="w-125 h-auto rounded-[20px]"
      />
      {/* rating */}
      <div className="absolute top-[141px] left-[307px]">
        <div className="p-space-5 rounded-2xl bg-secondary/5 border-3 border-secondary/20 flex flex-col items-center justify-center relative backdrop-blur-[10px]">
          <h4 className="font-primary font-semibold text-size-h2">4.9</h4>
          <p className="font-medium text-size-h3 text-placeholder_3 text-nowrap">
            Market Rating
          </p>
          <i className="fi fi-ss-star text-[90px] text-[#FFC107] absolute -top-11.25 -left-11.25"></i>
        </div>
      </div>

      {/* customer_1 */}
      <div className="absolute top-[82px] left-[899px]">
        <div className="p-space-5 rounded-2xl bg-secondary/5 border-3 border-secondary/20 flex flex-col items-center justify-center w-[300px] relative backdrop-blur-[10px]">
          <p className="font-primary font-medium text-size-large">
            &quot;I absolutely love the home décor I ordered! The quality is
            amazing and it fits perfectly in my living room. Delivery was fast
            too. Highly recommend!&quot;
          </p>
          <div className="mt-space-2 w-full">
            <h6 className="font-medium text-size-h6 mb-space-1 text-placeholder_3">
              -Sara M.
            </h6>
            <p className="font-medium text-size-large text-placeholder">
              Dhaka, Bangladesh
            </p>
          </div>

          <Image
            width={1000}
            height={1000}
            alt="quotes"
            src={assets.quotes}
            className="absolute bottom-0 -right-6.25 w-13.75 h-13.75"
          />
        </div>
      </div>

      {/* customer_2 */}
      <div className="absolute top-[485.99px] left-[190.93px]">
        <div className="py-space-5 pr-space-5 pl-[60px] rounded-2xl bg-secondary/5 border-3 border-secondary/20 flex flex-col items-center justify-center w-[300px] backdrop-blur-[10px]">
          <p className="font-primary font-medium text-size-large">
            &quot;I absolutely love the home décor I ordered! The quality is
            amazing and it fits perfectly in my living room. Delivery was fast
            too. Highly recommend!&quot;
          </p>
          <div className="mt-space-2 w-full">
            <h6 className="font-medium text-size-h6 mb-space-1 text-placeholder_3">
              -Sara M.
            </h6>
            <p className="font-medium text-size-large text-placeholder">
              Dhaka, Bangladesh
            </p>
          </div>

          <Image
            width={1000}
            height={1000}
            alt="quotes"
            src={assets.user_1}
            className="absolute bottom-[4px] -left-[42px] w-auto h-[128px] object-cover rounded-[8px]"
          />
        </div>
      </div>

            {/* customer_3 */}
      <div className="absolute top-[485.99px] left-[919px]">
        <div className="py-space-5 pl-space-5 pr-[72px] rounded-2xl bg-secondary/5 border-3 border-secondary/20 flex flex-col items-center justify-center w-[333px] backdrop-blur-[10px]">
          <p className="font-primary font-medium text-size-large">
            &quot;I absolutely love the home décor I ordered! The quality is
            amazing and it fits perfectly in my living room. Delivery was fast
            too. Highly recommend!&quot;
          </p>
          <div className="mt-space-2 w-full">
            <h6 className="font-medium text-size-h6 mb-space-1 text-placeholder_3">
              -Sara M.
            </h6>
            <p className="font-medium text-size-large text-placeholder">
              Dhaka, Bangladesh
            </p>
          </div>

          <Image
            width={1000}
            height={1000}
            alt="quotes"
            src={assets.user_2}
            className="absolute top-[36.5px] -right-[60px] w-[120px] h-[120px] object-cover rounded-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Marketing;
