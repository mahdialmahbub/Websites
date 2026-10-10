import React from "react";
import FieldCardHeader from "./FieldCardHeader";
import { Button } from "../Button";
import { Input } from "../Input";
import Checkbox from "../Checkbox";
import { Textarea } from "../Textarea";

const Education = () => {
  return (
    <div className="p-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] rounded-[8px] space-y-space-7 shadow-[0_1px_4px_rgba(2,6,23,0.10),0_-1px_4px_rgba(2,6,23,0.06)]">
      <FieldCardHeader />

      <div className="space-y-space-8">
        <Input label="Institution Name" placeholder="University of Dhaka" />
        <Input
          label="Degree / Qualification"
          placeholder="Bachelor of Science in Computer Science"
        />
        <Input
          label="Field of Study"
          placeholder="Computer Science & Engineering"
        />
        <div className="flex max-sm:flex-col gap-space-4 *:flex-1">
          <div>
            <Input
              label="Start Date"
              placeholder="DD / MM / YYYY"
              variant="calendar"
            />
            <div className="flex items-center gap-space-0 mt-space-4">
              <Checkbox />
              Currently Studing Here
            </div>
          </div>

          <Input
            label="End Date / Graduate"
            placeholder="DD / MM / YYYY"
            variant="calendar"
          />
        </div>
        <Input label="GPA / CGPA" placeholder="3.75 / 4.00" />
        <div className="flex flex-col items-end gap-space-2">
          <Textarea
            label="Description"
            placeholder={
              "Relevant coursework, academic achievements, or activities ..."
            }
          />
          <Button
            varient="text"
            className="content-end"
            icon="fi fi-rr-magic-wand"
          >
            AI Enhance
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

export default Education;
