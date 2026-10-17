import React from "react";
import FieldCardHeader from "./FieldCardHeader";
import { Button } from "../Button";
import { Input } from "../Input";
import Checkbox from "../Checkbox";
import { Textarea } from "../Textarea";

const Experience = () => {
  return (
    <div className="p-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] rounded-lg space-y-space-7 shadow-[0_1px_4px_rgba(2,6,23,0.10),0_-1px_4px_rgba(2,6,23,0.06)] ">
      <FieldCardHeader />

      <div className="space-y-space-8">
        <Input label="Company Name" placeholder="Google LLC" />
        <Input label="Job Title" placeholder="Senior UI/UX Designer" />
        <Input label="Employee Type" placeholder="Full-time" />
        <Input label="Location" placeholder="Dhaka, Bangladesh" />
        <div className="flex max-sm:flex-col gap-space-4 *:flex-1">
          <div>
            <Input
              label="Start Date"
              placeholder="DD / MM / YYYY"
              variant="calendar"
            />
            <div className="flex items-center gap-space-0 mt-space-4">
              <Checkbox />
              Currently Working Here
            </div>
          </div>

          <Input
            label="End Date / Graduate"
            placeholder="DD / MM / YYYY"
            variant="calendar"
          />
        </div>
        <div className="flex flex-col items-end gap-space-2 mb-2">
          <Textarea
            label="Job Description"
            placeholder={
              "Led a team of 5 designers and improved website conversion by 20% ..."
            }
          />
          <Button
            variant="text"
            className="text-orange-500 hover:text-orange-600"
            icon="fi fi-rr-magic-wand"
          >
            Improve with AI
          </Button>
        </div>
      </div>

      <Button
        variant="secondary"
        icon="fi fi-rr-plus-small"
        className="bg-green-500/5 text-green-500 hover:bg-green-500/10 w-full"
      >
        Add More
      </Button>
    </div>
  );
};

export default Experience;
