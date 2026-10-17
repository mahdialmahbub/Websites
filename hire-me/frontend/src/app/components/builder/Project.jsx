import React from "react";
import FieldCardHeader from "./FieldCardHeader";
import { Button } from "../Button";
import { Input } from "../Input";
import Checkbox from "../Checkbox";
import { Textarea } from "../Textarea";
import { icons } from "../../../../assets/iconCollection";
import Tabs from "../Tabs";

const Project = () => {
  return (
    <div className="p-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] rounded-lg space-y-space-7 border border-violet-900/5 shadow-[0_1px_4px_rgba(2,6,23,0.10),0_-1px_4px_rgba(2,6,23,0.06)]">
      <FieldCardHeader />

      <div className="space-y-space-8">
        <Input
          label="Project Name"
          placeholder="TechWorld E-commerce Platform"
        />
        <Input label="Project type" placeholder="Personal Project" />
        <Input label="Role" placeholder="Full-Stack Developer" />

        <div className="flex flex-col items-end gap-space-2 mb-2">
          <Textarea
            label="Key Responsibilities"
            placeholder={
              "Built the REST API and implemented authentication ..."
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
        <Input
          label="Key Achievements"
          placeholder="Improved page performance by 35% ..."
        />

        <div>
          <div className="flex items-end gap-2.5 mb-space-6">
            <Input
              label="Technologies & Tools"
              placeholder="Next.js, Node.js, MongoDB, Figma"
            />
            <Button
              icon={icons.addSmall}
              variant="secondary"
              className="text-[22px] text-green-500 bg-green-500/5 hover:bg-green-500/10"
            ></Button>
          </div>
          <div className="flex items-center gap-space-2">
            <Tabs label="Graphic Design" variant="add" />
          </div>
        </div>

        <Input label="Project URL" placeholder="https://yourproject.com" />
        <div className="flex flex-col items-end gap-space-2 mb-2">
          <Textarea
            label="Project Description"
            placeholder={
              "Briefly describe the project and the problem it solves ..."
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

export default Project;
