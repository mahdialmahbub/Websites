import React from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import FilterToggle from "../components/home/FilterToggle";
import TemplateGallery from "../components/builder/TemplateGallery";

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
      <TemplateGallery/>
      <div></div>
    </main>
  );
};

export default page;
