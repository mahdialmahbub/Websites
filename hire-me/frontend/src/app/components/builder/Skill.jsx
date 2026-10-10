import React from "react";
import { Input } from "../Input";
import { Button } from "../Button";

const Skill = () => {
  return (
    <div className="flex flex-col gap-space-7">
      {/* input and add button */}
      <div className="flex items-center gap-3.25">
        <Input
          placeholder="Enter skill to add"
          aria-label="Type a skill and press Enter to add it"
        />
        <Button
          variant="secondary"
          aria-label="Add the entered skill to your skills list"
          icon="fi fi-rr-plus-small"
          className="text-green-500 bg-green-500/5 hover:bg-green-500/10"
        ></Button>
      </div>

      <div className="flex gap-space-2">
        No skills yet. Add relevant skills.
      </div>

      <div>
        <p className="text-small text-neutral-500/70 mb-space-5">
          Suggested skills. Match skills to your target job.
        </p>
        <div className="flex gap-space-2">make tag component to add</div>
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

export default Skill;
