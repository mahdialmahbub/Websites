import React from "react";
import FieldCardHeader from "./FieldCardHeader";
import { Button } from "../Button";
import { Input } from "../Input";
import Checkbox from "../Checkbox";
import { Textarea } from "../Textarea";

const Reference = () => {
  return (
    <div className="p-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] rounded-lg space-y-space-7 shadow-[0_1px_4px_rgba(2,6,23,0.10),0_-1px_4px_rgba(2,6,23,0.06)] ">
      <FieldCardHeader />

      <div className="space-y-space-8">
        <Input label="Reference Name" placeholder="Sarah Ahmed" />
        <Input label="Job Title" placeholder="Senior Software Engineer" />
        <Input
          label="Company / Organization"
          placeholder="ABC Technologies Ltd."
        />
        <Input label="Relationship" placeholder="Former Manager" />
        <Input label="Email Address" placeholder="sarah.ahmed@example.com" />
        <Input label="Phone Number" placeholder="+880 17XXX XXXXX" />
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

export default Reference;
