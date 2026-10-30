"use client";

import React, { useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import Tabs from "../Tabs";
import { useSection } from "./useSection";
import { useSuggestKeywordsMutation } from "@/store/api/aiApi";
import { useFormTarget } from "./formTarget";
import { useSelector } from "react-redux";
import { LIMITS } from "@/resume/validation";

const Skill = () => {
  const { value: skills, dispatch, actions, sectionError } = useSection("skills");
  const { addSkill, removeSkill } = actions;
  const { stateKey } = useFormTarget();
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");

  // Optional AI keyword ideas for the job title. Only suggestions: the person clicks the ones they really have.
  const title = useSelector((state) => state[stateKey].content.personalInformation.professionalTitle);
  const targetJobTitle = useSelector((state) => state[stateKey].content.targetJob?.title);
  const [suggestKeywords, { isLoading: ideasLoading }] = useSuggestKeywordsMutation();
  const [ideas, setIdeas] = useState([]);
  const [ideasError, setIdeasError] = useState("");

  const getIdeas = async () => {
    setIdeasError("");
    try {
      const result = await suggestKeywords({ professionalTitle: title ?? "", targetJobTitle: targetJobTitle ?? "", skills }).unwrap();
      setIdeas(result.keywords);
    } catch (error) {
      setIdeasError(error?.message || "Could not get keyword ideas. Please try again.");
    }
  };

  const addIdea = (keyword) => {
    dispatch(addSkill(keyword));
    setIdeas((current) => current.filter((idea) => idea !== keyword));
  };

  // A skill the user typed meanwhile is not offered again.
  const visibleIdeas = ideas.filter((idea) => !skills.some((skill) => skill.toLowerCase() === idea.toLowerCase()));

  const atMax = skills.length >= LIMITS.skills.max;

  // "React, Node.js" adds both; duplicates (any letter case) are ignored.
  const add = () => {
    const names = text.split(",").map((name) => name.trim()).filter(Boolean);
    if (names.length === 0) return;

    let room = LIMITS.skills.max - skills.length;
    const known = new Set(skills.map((skill) => skill.toLowerCase()));
    const duplicates = [];
    for (const name of names) {
      if (known.has(name.toLowerCase())) {
        duplicates.push(name);
        continue;
      }
      if (room <= 0) break;
      dispatch(addSkill(name.slice(0, LIMITS.skills.length)));
      known.add(name.toLowerCase());
      room -= 1;
    }
    setText("");
    setNotice(duplicates.length ? `"${duplicates[0]}" is already in your list` : room <= 0 ? `You can add up to ${LIMITS.skills.max} skills` : "");
  };

  return (
    <div className="flex flex-col gap-space-7">
      {/* input and add button */}
      <div className="flex items-start gap-3.25">
        <Input
          placeholder="Enter skill to add"
          aria-label="Type a skill and press Enter to add it"
          maxLength={LIMITS.skills.length}
          disabled={atMax}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          validation={notice ? "error" : "default"}
          helperText={notice || undefined}
        />
        <Button
          type="button"
          variant="secondary"
          aria-label="Add the entered skill to your skills list"
          icon="fi fi-rr-plus-small"
          disabled={atMax}
          onClick={add}
          className="text-green-500 bg-green-500/5 hover:bg-green-500/10"
        ></Button>
      </div>

      {skills.length === 0 ? (
        <div className="flex gap-space-2 text-neutral-500/70">No skills yet. Add relevant skills.</div>
      ) : (
        <ul aria-label="Your skills" className="flex flex-wrap gap-space-2">
          {skills.map((skill) => (
            <li key={skill}>
              <Tabs label={skill} variant="remove" onIconClick={() => dispatch(removeSkill(skill))} />
            </li>
          ))}
        </ul>
      )}

      {/* keyword ideas (optional) */}
      <div className="flex flex-col gap-space-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] text-neutral-500/80">
            Match your skills to the job: get keyword ideas for {targetJobTitle || title || "your title"}.
          </p>
          <Button
            type="button"
            variant="text"
            icon="fi fi-rr-magic-wand"
            loading={ideasLoading}
            disabled={ideasLoading || atMax}
            onClick={getIdeas}
            className="text-orange-500 hover:text-orange-600"
          >
            {ideasLoading ? "Thinking…" : visibleIdeas.length > 0 ? "New ideas" : "Get keyword ideas"}
          </Button>
        </div>
        {ideasError && (
          <p role="alert" className="text-small text-red-600">
            {ideasError}
          </p>
        )}
        {visibleIdeas.length > 0 && (
          <ul aria-label="Keyword ideas. Add the ones you really have." className="flex flex-wrap gap-space-2">
            {visibleIdeas.map((keyword) => (
              <li key={keyword}>
                <Tabs label={keyword} variant="add" onIconClick={() => addIdea(keyword)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {sectionError && (
        <p role="alert" className="text-small text-red-600">
          {sectionError}
        </p>
      )}

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
