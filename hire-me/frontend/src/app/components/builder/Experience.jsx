"use client";

import React from "react";
import { Input } from "../Input";
import Checkbox from "../Checkbox";
import { Textarea } from "../Textarea";
import AiEnhanceButton from "./AiEnhanceButton";
import EntryList from "./EntryList";
import { useSection } from "./useSection";
import { LIMITS } from "@/resume/validation";

const L = LIMITS.workExperience;

const Experience = () => {
  const { value: items, dispatch, actions, field, errors, sectionError } = useSection("workExperience");
  const { updateItem } = actions;

  return (
    <EntryList
      section="workExperience"
      items={items}
      max={L.max}
      dispatch={dispatch}
      errors={errors}
      sectionError={sectionError}
      renderEntry={(item) => {
        const set = (key) => (event) => dispatch(updateItem({ section: "workExperience", id: item.id, field: key, value: event.target.value }));
        const f = (key) => field(`${item.id}.${key}`);
        return (
          <>
            <Input label="Company Name" placeholder="Google LLC" requiredLabel maxLength={L.companyName} value={item.companyName} onChange={set("companyName")} {...f("companyName")} />
            <Input label="Job Title" placeholder="Senior UI/UX Designer" requiredLabel maxLength={L.jobTitle} value={item.jobTitle} onChange={set("jobTitle")} {...f("jobTitle")} />
            <Input label="Employee Type" placeholder="Full-time" maxLength={L.employeeType} value={item.employeeType} onChange={set("employeeType")} {...f("employeeType")} />
            <Input label="Location" placeholder="Dhaka, Bangladesh" maxLength={L.location} value={item.location} onChange={set("location")} {...f("location")} />
            <div className="flex max-sm:flex-col gap-space-4 *:flex-1">
              <div>
                <Input label="Start Date" type="date" icon={null} value={item.startDate} onChange={set("startDate")} {...f("startDate")} />
                <div className="flex items-center gap-space-0 mt-space-4">
                  <Checkbox
                    label="Currently Working Here"
                    checked={item.currentlyWorking}
                    onChange={(event) => dispatch(updateItem({ section: "workExperience", id: item.id, field: "currentlyWorking", value: event.target.checked }))}
                  />
                </div>
              </div>
              <Input label="End Date" type="date" icon={null} disabled={item.currentlyWorking} min={item.startDate || undefined} value={item.currentlyWorking ? "" : item.endDate} onChange={set("endDate")} {...f("endDate")} />
            </div>
            <div className="flex flex-col items-end gap-space-2">
              <Textarea
                label="Job Description"
                placeholder={"Led a team of 5 designers and improved website conversion by 20% ..."}
                maxLength={L.jobDescription}
                value={item.jobDescription}
                onChange={set("jobDescription")}
                {...f("jobDescription")}
              />
              <AiEnhanceButton section="workExperience" itemId={item.id} field="jobDescription" />
            </div>
          </>
        );
      }}
    />
  );
};

export default Experience;
