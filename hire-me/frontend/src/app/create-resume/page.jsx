import React from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import FilterToggle from "../components/home/FilterToggle";

const page = () => {
  return (
    <main className="px-[clamp(1.5rem,calc(2.254vw+0.972rem),3rem)] py-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] gap-[clamp(2rem,calc(1.502vw+1.648rem),3rem)] md:max-w-200 md:mx-auto min-w-[320px] md:rounded-xl md:border md:border-neutral-500/20 md:my-[32px]">
      <h1 className="text-[clamp(1.625rem,calc(0.939vw+1.405rem),2.25rem)] font-primary font-semibold mb-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)]">
        Create a Resume
      </h1>
      <p className="text-body mb-space-7 text-neutral-500">
        Enter a title for your resume, and we’ll recommend professional
        templates that best match your career, role, and resume style.
      </p>
      <Input
        label="Resume Title"
        placeholder="Graphic Designer"
        className="mb-[clamp(2rem,calc(1.502vw+1.648rem),3rem)]"
      />
      {/* Resume Templete Select */}
      <div className="flex flex-col items-center justify-center w-full">
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

        <div className="flex items-center gap-[clamp(1rem,calc(1.127vw+0.736rem),1.75rem)] mt-[clamp(2rem,calc(1.502vw+1.648rem),3rem)] w-full *:flex-1">
          <Button
            variant="secondary"
            className="bg-red-500/5 text-red-500 hover:bg-red-500/10"
          >
            Cancel
          </Button>
          <Button>Create Resume</Button>
        </div>
      </div>
      <div></div>
    </main>
  );
};

export default page;
