"use client";

import React, { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { icons } from "../../../../assets/iconCollection";
import Tabs from "../Tabs";
import AiEnhanceButton from "./AiEnhanceButton";
import EntryList from "./EntryList";
import { useSection } from "./useSection";
import { LIMITS } from "@/resume/validation";

const L = LIMITS.projects;

/** The "Technologies & Tools" input of one project: type a name, press Enter or the + button. */
function TechnologyField({ item, dispatch, updateItem, error }) {
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const technologies = item.technologies ?? [];

  const save = (next) => dispatch(updateItem({ section: "projects", id: item.id, field: "technologies", value: next }));

  const add = () => {
    // "Next.js, Node.js" adds both
    const names = text.split(",").map((name) => name.trim()).filter(Boolean);
    if (names.length === 0) return;
    const next = [...technologies];
    for (const name of names) {
      if (next.length >= L.technologies) {
        setNotice(`You can add up to ${L.technologies} technologies`);
        break;
      }
      if (!next.some((existing) => existing.toLowerCase() === name.toLowerCase())) next.push(name.slice(0, L.technology));
    }
    save(next);
    setText("");
    if (next.length < L.technologies) setNotice("");
  };

  return (
    <div>
      <div className="flex items-end gap-2.5 mb-space-6">
        <Input
          label="Technologies & Tools"
          placeholder="Next.js, Node.js, MongoDB, Figma"
          maxLength={200}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          validation={notice || error ? "error" : "default"}
          helperText={notice || error}
        />
        <Button
          type="button"
          icon={icons.addSmall}
          variant="secondary"
          aria-label="Add the entered technologies"
          onClick={add}
          className="text-[22px] text-green-500 bg-green-500/5 hover:bg-green-500/10"
        ></Button>
      </div>
      <div className="flex flex-wrap items-center gap-space-2">
        {technologies.map((name) => (
          <Tabs key={name} label={name} variant="remove" onIconClick={() => save(technologies.filter((tech) => tech !== name))} />
        ))}
      </div>
    </div>
  );
}

const Project = () => {
  const { value: items, dispatch, actions, field, errors, sectionError } = useSection("projects");
  const { updateItem } = actions;

  return (
    <EntryList
      section="projects"
      label="project"
      items={items}
      max={L.max}
      dispatch={dispatch}
      sectionError={sectionError}
      renderEntry={(item) => {
        const set = (key) => (event) => dispatch(updateItem({ section: "projects", id: item.id, field: key, value: event.target.value }));
        const f = (key) => field(`${item.id}.${key}`);
        return (
          <>
            <Input label="Project Name" placeholder="TechWorld E-commerce Platform" requiredLabel maxLength={L.projectName} value={item.projectName} onChange={set("projectName")} {...f("projectName")} />
            <Input label="Project type" placeholder="Personal Project" maxLength={L.projectType} value={item.projectType} onChange={set("projectType")} {...f("projectType")} />
            <Input label="Role" placeholder="Full-Stack Developer" maxLength={L.role} value={item.role} onChange={set("role")} {...f("role")} />

            <div className="flex flex-col items-end gap-space-2 mb-2">
              <Textarea
                label="Key Responsibilities"
                placeholder={"Built the REST API and implemented authentication ..."}
                maxLength={L.keyResponsibilities}
                value={item.keyResponsibilities}
                onChange={set("keyResponsibilities")}
                {...f("keyResponsibilities")}
              />
              <AiEnhanceButton section="projects" itemId={item.id} field="keyResponsibilities" />
            </div>
            <Input label="Key Achievements" placeholder="Improved page performance by 35% ..." maxLength={L.keyAchievements} value={item.keyAchievements} onChange={set("keyAchievements")} {...f("keyAchievements")} />

            <TechnologyField item={item} dispatch={dispatch} updateItem={updateItem} error={errors[`${item.id}.technologies`]} />

            <Input label="Project URL" placeholder="yourproject.com" inputMode="url" maxLength={LIMITS.url} value={item.projectUrl} onChange={set("projectUrl")} {...f("projectUrl")} />
            <div className="flex flex-col items-end gap-space-2">
              <Textarea
                label="Project Description"
                placeholder={"Briefly describe the project and the problem it solves ..."}
                maxLength={L.projectDescription}
                value={item.projectDescription}
                onChange={set("projectDescription")}
                {...f("projectDescription")}
              />
              <AiEnhanceButton section="projects" itemId={item.id} field="projectDescription" />
            </div>
          </>
        );
      }}
    />
  );
};

export default Project;
