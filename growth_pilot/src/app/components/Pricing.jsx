import React from "react";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import Image from "next/image";
import { assets } from "../assets/assets";
import PlanTag from "./PlanTag";

const Pricing = () => {
  const pricingStart = [
    "Basic marketing automation",
    "Email campaign setup",
    "Limited analytics dashboard",
    "Up to 1,000 contacts",
    "Basic integrations",
  ];

  const pricingPro = [
    "Advanced automation workflows",
    "Full analytics & performance tracking",
    "AI-powered suggestions",
    "Up to 10,000 contacts",
    "All integrations included",
    "Priority support",
  ];

  const pricingBusiness = [
    "Unlimited automation workflows",
    "Advanced analytics & reports",
    "AI optimization & insights",
    "Unlimited contacts",
    "Custom integrations",
    "Dedicated account manager",
  ];

  return (
    <section className="section">
      <SectionHeading
        title={"Choose the Plan That Fits Your Growth"}
        subtitle={
          "No hidden fees. Start free, upgrade anytime as your business grows."
        }
        tagName={"Pricing"}
      />
      <div className="flex max-md:flex-col gap-[16px] md:gap-[16px] xl:gap-[48px] ">
        {/* Pricing Card 1 */}
        <div className="rounded-[40px] md:rounded-[45px] pt-[4px] w-full bg-accent2 text-center flex-1 h-max shadow-[0_0_5px] shadow-accent2 hover:shadow-[0_0_10px]">
          <h3 className="text-white text-medium md:text-large font-semibold text-center w-full">
            Entry Level
          </h3>
          <div className="w-full xl:w-75 bg-accent2-bg dark:bg-black border border-accent2/30  dark:border-accent2 dark:border-2 rounded-[20px] xl:rounded-3xl overflow-hidden">
            <div className="w-full bg-[#BEE9FB] rounnded-[20px] xl:rounded-3xl">
              {/* Price info */}
              <div className="p-[12px] xl:p-[16px] gap-[4px] items-end flex flex-col">
                <PlanTag tagName={"Starter Plan"} className={"bg-accent2"} />
                <div className="w-full">
                  <div className="w-full flex items-end">
                    <h2 className="font-medium text-h3 xl:text-h2 dark:text-black">
                      $29
                    </h2>
                    <p className="font-semibold text-large xl:text-h5 dark:text-black">
                      /month
                    </p>
                  </div>
                  <p className="text-large text-black/70 mt-[4px] xl:mt-[8px]">
                    Perfect for individuals and small startups
                  </p>
                </div>
              </div>
            </div>
            {/* Features list */}
            <div className="py-[12px] px-[8px] gap-[12px] md:py-[16px] md:px-[12px] md:gap-[16px] xl:py-[20px] xl:px-[16px] xl:gap-[20px] w-full flex flex-col items-start dark:bg-black">
              {pricingStart.map((item, i) => (
                <div key={i} className="flex gap-[4px]">
                  <Image
                    src={assets.tic}
                    alt="Tick Icon"
                    className="size-[20px]"
                  />
                  <p className="text-large xl:text-h6 text-black/70 font-medium text-start dark:text-white/70">
                    {item}
                  </p>
                </div>
              ))}

              <Button fullWidth text="Start Free Trial" />
            </div>
          </div>
        </div>
        {/* Pricing Card 2 */}
        <div className="rounded-[40px] md:rounded-[45px] pt-[4px] w-full bg-accent3 text-center flex-1 h-full shadow-[0_0_5px] shadow-accent3 hover:shadow-[0_0_10px]">
          <h3 className="text-white text-medium md:text-large font-semibold text-center w-full">
            Entry Level
          </h3>
          <div className="w-full xl:w-75 bg-accent3-bg dark:bg-black border border-accent3/30  dark:border-accent3 dark:border-2 rounded-[20px] xl:rounded-3xl overflow-hidden">
            <div className="w-full bg-[#AEEBC6]  rounnded-[20px] xl:rounded-3xl">
              {/* Price info */}
              <div className="p-[12px] xl:p-[16px] gap-[4px] items-end flex flex-col">
                <PlanTag tagName={"Starter Plan"} className={"bg-accent3"} />

                <div className="w-full">
                  <div className="w-full flex items-end">
                    <h2 className="font-medium text-h3 xl:text-h2 dark:text-black">$29</h2>
                    <p className="font-semibold text-large xl:text-h5 dark:text-black">
                      /month
                    </p>
                  </div>
                  <p className="text-large text-black/70 mt-[4px] xl:mt-[8px]">
                    Perfect for individuals and small startups
                  </p>
                </div>
              </div>
            </div>
            {/* Features list */}
            <div className="py-[12px] px-[8px] gap-[12px] md:py-[16px] md:px-[12px] md:gap-[16px] xl:py-[20px] xl:px-[16px] xl:gap-[20px] w-full flex flex-col items-start">
              {pricingPro.map((item, i) => (
                <div key={i} className="flex gap-[4px]">
                  <Image
                    src={assets.tic}
                    alt="Tick Icon"
                    className="size-[20px]"
                  />
                  <p className="text-large xl:text-h6 text-black/70 font-medium text-start dark:text-white/70">
                    {item}
                  </p>
                </div>
              ))}

              <Button fullWidth text="Start Free Trial" />
            </div>
          </div>
        </div>
        {/* Pricing Card 3 */}
        <div className="rounded-[40px] md:rounded-[45px] pt-[4px] w-full bg-accent5 text-center flex-1 shadow-[0_0_5px] shadow-accent5 hover:shadow-[0_0_10px]">
          <h3 className="text-white text-medium md:text-large font-semibold text-center w-full">
            Entry Level
          </h3>
          <div className="w-full xl:w-75 bg-accent5-bg dark:bg-black border border-accent5/30  dark:border-accent5 dark:border-2 rounded-[20px] xl:rounded-3xl overflow-hidden">
            <div className="w-full bg-[#F9BEDA]  rounnded-[20px] xl:rounded-3xl">
              {/* Price info */}
              <div className="p-[12px] xl:p-[16px] gap-[4px] items-end flex flex-col">
                <PlanTag tagName={"Starter Plan"} className={"bg-accent5"} />

                <div className="w-full">
                  <div className="w-full flex items-end">
                    <h2 className="font-medium text-h3 xl:text-h2 dark:text-black">$29</h2>
                    <p className="font-semibold text-large xl:text-h5 dark:text-black">
                      /month
                    </p>
                  </div>
                  <p className="text-large text-black/70 mt-[4px] xl:mt-[8px]">
                    Perfect for individuals and small startups
                  </p>
                </div>
              </div>
            </div>
            {/* Features list */}
            <div className="py-[12px] px-[8px] gap-[12px] md:py-[16px] md:px-[12px] md:gap-[16px] xl:py-[20px] xl:px-[16px] xl:gap-[20px] w-full flex flex-col items-start">
              {pricingPro.map((item, i) => (
                <div key={i} className="flex gap-[4px]">
                  <Image
                    src={assets.tic}
                    alt="Tick Icon"
                    className="size-[20px]"
                  />
                  <p className="text-large xl:text-h6 text-black/70 font-medium text-start dark:text-white/70">
                    {item}
                  </p>
                </div>
              ))}
              <Button fullWidth text="Start Free Trial" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
