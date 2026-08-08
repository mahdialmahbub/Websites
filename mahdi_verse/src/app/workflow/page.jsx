import React from "react";
import { UIUXWorkflow } from "../assets/assets";
import SwitchBTN from "../components/SwitchBTN";

const page = () => {
  return (
    <section className="">
      <div className="flex items-center justify-between gap-space-4">
        <div className="">
          <h1 className="font-primary text-size-xl font-semibold">
            My UI/UX Design Process
          </h1>
          <p className="font-medium text-size-base text-placeholder_2">
            I&apos;m a UI/UX and Product Designer who creates user-centered
            websites that balance great design with real business goals.
          </p>
        </div>
        {/* workflow switch */}
        <div className=" p-space-3 bg-secondary-50 flex flex-col gap-space-3 ">
          <SwitchBTN icon="fi fi-rr-website-design" text="UI UX Design" />
          <SwitchBTN text="Web Developmernt" isActive />
        </div>
      </div>
      <div className="h-space-1 w-full rounded-full opacity-20 bg-placeholder mt-space-7 mb-space-7"></div>
      <div className="flex flex-col gap-space-6 ">
        {UIUXWorkflow.map((item) => (
          <div
            key={item.id}
            className="rounded-[12px] bg-secondary-50 border border-secondary-100 p-space-7 relative"
          >
            {/* watermark */}
            <h2 className="absolute top-0 right-0 font-primary text-[120px] font-bold text-secondary-500 opacity-10">
              {item.phaseNumber}
            </h2>

            <div className="flex items-center gap-space-3 mb-space-5">
              <div className="rounded-[8px] bg-secondary-50 border border-secondary-100 w-10 h-10 *:text-size-lg *:text-secondary-600 flex items-center justify-center">
                <i className={`${item.icon}`}></i>
              </div>
              <div className="">
                <h3 className="text-secondary-600 font-bold text-size-xs">
                  {item.phaseLabel}
                </h3>
                <h2 className="font-semibold text-size-lg">{item.title}</h2>
              </div>
            </div>
            <div className="space-y-space-2">
              <h3 className="font-semibold text-size-base">{item.tagline}</h3>
              <p className="font-medium text-size-base text-placeholder_2">
                {item.description}
              </p>
            </div>
            <div className="w-full h-px bg-placeholder opacity-20 rounded-full my-space-4"></div>
            <div className="grid grid-cols-3 space-y-space-7 space-x-space-6">
              {item.points.map((item) => (
                <div key={item.id} className="flex gap-space-2">
                  <div className="size-[24px] flex items-center justify-center rounded-[6px] bg-secondary-900/10 ">
                    <p className="text-size-xs font-semibold font-primary text-secondary-900">
                      {item.number}
                    </p>
                  </div>
                  <div className="">
                    <h2 className="mb-space-1 font-semibold text-size-base text-secondary-900">
                      {item.title}
                    </h2>
                    <p className="font-medium text-size-sm text-placeholder_2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default page;
