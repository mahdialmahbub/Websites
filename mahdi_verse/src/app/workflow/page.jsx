"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { MERNStackWorkflow, UIUXWorkflow } from "../assets/assets";
import SwitchBTN from "../components/SwitchBTN";
import Reveal from "../components/Reveal";
import FadeUp from "../components/motions/FadeUp";
import FadeLeft from "../components/motions/FadeLeft";
import FadeRight from "../components/motions/FadeRight";

const page = () => {
  const [activeCategory, setActiveCategory] = useState("UI UX Design");

  const filteredWorkflows =
    activeCategory === "UI UX Design" ? UIUXWorkflow : MERNStackWorkflow;

  return (
    <section className="">
      <div className="flex items-center justify-between gap-space-4">
        <div className="">
          <FadeLeft>
            <h1 className="font-primary text-size-xl font-semibold">
              My UI/UX Design Process
            </h1>
          </FadeLeft>
          <FadeLeft delay={0.1}>
            <p className="font-medium text-size-base text-placeholder_2 dark:text-placeholder mt-space-2">
              I&apos;m a UI/UX and Product Designer who creates user-centered
              websites that balance great design with real business goals.
            </p>
          </FadeLeft>
        </div>
        {/* workflow switch */}
        <FadeRight delay={0.1} className=" p-space-3 bg-secondary-50 flex flex-col gap-space-3 dark:bg-secondary-500/10 rounded-lg">
          <SwitchBTN
            icon="fi fi-rr-website-design"
            text="UI UX Design"
            isActive={activeCategory == "UI UX Design"}
            onClick={() => setActiveCategory("UI UX Design")}
          />
          <SwitchBTN
            text="Web Developmernt"
            isActive={activeCategory == "Web Developmernt"}
            onClick={() => setActiveCategory("Web Developmernt")}
          />
        </FadeRight>
      </div>
      <div className="h-space-1 w-full rounded-full opacity-20 bg-placeholder mt-space-7 mb-space-7"></div>
      <div className="flex flex-col gap-space-6 ">
        {filteredWorkflows.map((item) => (
          <FadeUp key={item.id}>
            <div className="rounded-xl bg-secondary-50 border border-secondary-100 p-space-7 relative dark:bg-secondary-500/5 dark:border-secondary-500/10">
              {/* watermark */}
              <h2 className="absolute top-0 right-0 font-primary text-[120px] font-bold text-secondary-500 opacity-10 dark:opacity-5">
                {item.phaseNumber}
              </h2>

              <div className="flex items-center gap-space-3 mb-space-5">
                <div className="rounded-lg bg-secondary-50 border border-secondary-100 w-10 h-10 *:text-size-lg *:text-secondary-600 flex items-center justify-center dark:bg-secondary-500/5 dark:border-secondary-500/10">
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
                <h3 className="font-semibold text-size-base text-secondary-900 dark:text-secondary-50">
                  {item.tagline}
                </h3>
                <p className="font-medium text-size-base text-placeholder_2 dark:text-placeholder">
                  {item.description}
                </p>
              </div>
              <div className="w-full h-px bg-placeholder opacity-20 rounded-full my-space-4"></div>
              <div className="grid grid-cols-3 space-y-space-7 space-x-space-6">
                {item.points.map((item) => (
                  <div key={item.id} className="flex gap-space-2">
                    <div className="min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px] flex items-center justify-center rounded-md bg-secondary-900/10 dark:bg-secondary-600/10 ">
                      <p className="text-size-xs font-semibold font-primary text-secondary-900 dark:text-secondary-300">
                        {item.number}
                      </p>
                    </div>
                    <div className="">
                      <h2 className="mb-space-1 font-semibold text-size-base text-secondary-900 dark:text-secondary-50">
                        {item.title}
                      </h2>
                      <p className="font-medium text-size-sm text-placeholder_2 dark:text-placeholder">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};

export default page;
