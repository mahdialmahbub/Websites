"use client";

import React from "react";
import { Input } from "../Input";
import Checkbox from "../Checkbox";
import { Textarea } from "../Textarea";
import AiEnhanceButton from "./AiEnhanceButton";
import EntryList from "./EntryList";
import { useSection } from "./useSection";
import { LIMITS } from "@/resume/validation";

const L = LIMITS.education;

const Education = () => {
  const { value: items, dispatch, actions, field, sectionError } = useSection("education");
  const { updateItem } = actions;

  return (
    <EntryList
      section="education"
      label="education entry"
      items={items}
      max={L.max}
      dispatch={dispatch}
      sectionError={sectionError}
      renderEntry={(item) => {
        const set = (key) => (event) => dispatch(updateItem({ section: "education", id: item.id, field: key, value: event.target.value }));
        const f = (key) => field(`${item.id}.${key}`);
        return (
          <>
            <Input label="Institution Name" placeholder="University of Dhaka" requiredLabel maxLength={L.institutionName} value={item.institutionName} onChange={set("institutionName")} {...f("institutionName")} />
            <Input label="Degree / Qualification" placeholder="Bachelor of Science in Computer Science" maxLength={L.degree} value={item.degree} onChange={set("degree")} {...f("degree")} />
            <Input label="Field of Study" placeholder="Computer Science & Engineering" maxLength={L.fieldOfStudy} value={item.fieldOfStudy} onChange={set("fieldOfStudy")} {...f("fieldOfStudy")} />
            <div className="flex max-sm:flex-col gap-space-4 *:flex-1">
              <div>
                <Input label="Start Date" type="date" icon={null} value={item.startDate} onChange={set("startDate")} {...f("startDate")} />
                <div className="flex items-center gap-space-0 mt-space-4">
                  <Checkbox
                    label="Currently Studying Here"
                    checked={item.currentlyStudying}
                    onChange={(event) => dispatch(updateItem({ section: "education", id: item.id, field: "currentlyStudying", value: event.target.checked }))}
                  />
                </div>
              </div>
              <Input label="End Date / Graduate" type="date" icon={null} disabled={item.currentlyStudying} min={item.startDate || undefined} value={item.currentlyStudying ? "" : item.endDate} onChange={set("endDate")} {...f("endDate")} />
            </div>
            <Input label="GPA / CGPA" placeholder="3.75 / 4.00" maxLength={L.gpa} value={item.gpa} onChange={set("gpa")} {...f("gpa")} />
            <div className="flex flex-col items-end gap-space-2">
              <Textarea
                label="Description"
                placeholder={"Relevant coursework, academic achievements, or activities ..."}
                maxLength={L.description}
                value={item.description}
                onChange={set("description")}
                {...f("description")}
              />
              <AiEnhanceButton section="education" itemId={item.id} field="description" />
            </div>
          </>
        );
      }}
    />
  );
};

export default Education;
