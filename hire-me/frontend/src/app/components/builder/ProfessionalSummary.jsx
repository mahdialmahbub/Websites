import React from "react";
import { Textarea } from "../Textarea";
import { Button } from "../Button";

const ProfessionalSummary = () => {
  return (
    <div className=" flex flex-col gap-[clamp(0.75rem,calc(0.751vw+0.574rem),1.25rem)]">
      <div className="flex flex-col items-end gap-space-2">
        <Textarea
          label="Summery"
          placeholder={"A creative graphic designer with over 5 years ..."}
        />
        <Button
          varient="text"
          className="content-end"
          icon="fi fi-rr-magic-wand"
        >
          AI Enhance
        </Button>
      </div>
      <div className="p-[clamp(0.5rem,calc(0.751vw+0.324rem),1rem)] bg-blue-500/5 text-blue-500 text-center rounded-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)]">
        <p className="leading-[clamp(1.25rem,calc(0.188vw+1.206rem),1.375rem)]">
          Tip: Highlight your experience, strongest skills, and what you can
          bring to the role. Keep it clear, specific, and relevant to the job.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
