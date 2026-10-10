import React from "react";
import ResumeBTN from "../components/ResumeBTN";
import { Button } from "../components/Button";
import FilterToggle from "../components/home/FilterToggle";

const page = () => {
  return (
    <section className="px-[clamp(1.5rem,calc(2.254vw+0.972rem),3rem)] py-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] gap-space-10 min-w-[320px] max-w-300 mx-auto *:w-full">
      {/* resume */}
      <div className="">
        <div className="flex items-center max-sm:flex-col gap-space-7 max-sm:items-start mb-space-7">
          <div className="w-full">
            <h1 className="text-[clamp(1.625rem,calc(0.939vw+1.405rem),2.25rem)] mb-space-3">
              Your Resume
            </h1>
            <p className="leading-[24px] text-neutral-500">
              Enter a title for your resume, and we’ll recommend professional
              templates that best match your career, role, and resume style.
            </p>
          </div>
          <ResumeBTN />
        </div>
        <div className="flex items-center gap-[clamp(1.25rem,calc(1.127vw+0.986rem),2rem)]">
          {/* my resumes */}
        </div>
        
      </div>

      {/* Explore Templetes */}
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center gap-space-3">
          <FilterToggle>bal</FilterToggle>
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
    </section>
  );
};

export default page;
