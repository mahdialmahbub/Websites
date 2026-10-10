import React from "react";
import HomeHeader from "./HomeHeader";
import { Button } from "../Button";
import FilterToggle from "./FilterToggle";
import RecentResumeCard from "../RecentResumeCard";
import TempleteCard from "../TempleteCard";
import FAQCard from "../FAQCard";

const Templetes = () => {
  return (
    <section className="px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(2rem,calc(6.009vw+0.592rem),6rem)] space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]">
      <HomeHeader />

      {/* templetes */}
      <div>
        <div className="flex items-center gap-space-3">
            <FilterToggle>
                bal
            </FilterToggle>
        </div>

        {/*  */}
        <div className="flex items-center gap-[clamp(2rem,calc(3.005vw+1.296rem),4rem)] mt-[clamp(2.25rem,calc(0.376vw+2.162rem),2.5rem)] mb-[clamp(2rem,calc(1.127vw+1.736rem),2.75rem)]"></div>

        {/* Buttons */}
        <div className="flex items-center gap-space-0 max-sm:w-full max-sm:justify-between sm:gap-13">
          <Button
            iconOnly={true}
            icon="fi fi-rr-arrow-small-left"
            aria-label="Resume templetes left toggle button"
          />
          <span className="text-[18px]">
            2 <sub className="text-caption">/10</sub>
          </span>
          <Button
            iconOnly={true}
            icon="fi fi-rr-arrow-small-right"
            aria-label="Resume templetes right toggle button"
          />
        </div>
      </div>

      <RecentResumeCard/>
      <TempleteCard />
      <FAQCard/>

      {/* CTA */}
      <div className="rounded-md bg-white shadow-[1px_2px_6px_rgba(147,51,234,0.25)] flex items-center max-sm:flex-col gap-space-3 border-2 border-violet-500/10 px-[clamp(1.125rem,calc(0.376vw+1.037rem),1.375rem)] py-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)]">
        <div className="flex items-center gap-2.5">
            <span className="size-[clamp(1.625rem,calc(1.315vw+1.317rem),2.5rem)] bg-violet-500/5 border border-violet-500/10 flex items-center justify-center text-[clamp(0.875rem,calc(0.939vw+0.655rem),1.5rem)] text-violet-500/80">
            <i className="fi fi-sc-sparkles"></i>
            </span>
            <div className="">
                <h3 className="text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] font-primary font-medium mb-space-1 ">Not sure which template to choose?</h3>
                <p className="text-[clamp(0.75rem,calc(-0.188vw+0.919rem),0.875rem)] text-[#5C5C61]/80">Don’t worry! you can change your template anytime.</p>
            </div>
        </div>

        <Button variant="secondary" className="text-violet-500 bg-violet-500/5 *:text-[clamp(0.75rem,calc(-0.188vw+0.919rem),0.875rem)]">
            Start Build With AI
        </Button>
      </div>
    </section>
  );
};

export default Templetes;
