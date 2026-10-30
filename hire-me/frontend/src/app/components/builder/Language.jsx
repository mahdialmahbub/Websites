"use client";

import React, { useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { useSection } from "./useSection";
import { LANGUAGE_LEVELS, LIMITS } from "@/resume/validation";

const L = LIMITS.languages;
const SELECT =
  "block h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-[length:var(--text-body,1rem)] text-neutral-950 outline-none hover:border-neutral-400 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-200";

const Language = () => {
  const { value: items, dispatch, actions, field, sectionError } = useSection("languages");
  const { addItem, removeItem, updateItem } = actions;
  const [text, setText] = useState("");

  const atMax = items.length >= L.max;

  const add = () => {
    const name = text.trim();
    if (!name || atMax) return;
    if (!items.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      dispatch(addItem({ section: "languages", values: { name: name.slice(0, L.name) } }));
    }
    setText("");
  };

  return (
    <div className="flex flex-col gap-space-7">
      {/* input and add button */}
      <div className="flex items-center gap-3.25">
        <Input
          placeholder="Enter a language, like English"
          aria-label="Type a language and press Enter to add it"
          maxLength={L.name}
          disabled={atMax}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          aria-label="Add the entered language to your languages list"
          icon="fi fi-rr-plus-small"
          disabled={atMax}
          onClick={add}
          className="text-green-500 bg-green-500/5 hover:bg-green-500/10"
        ></Button>
      </div>

      {items.length === 0 ? (
        <div className=" flex items-center flex-col gap-[clamp(1rem,calc(0.751vw+0.824rem),1.5rem)]">
          <i className="text-[clamp(6.25rem,calc(3.756vw+5.370rem),8.75rem)] fi fi-rr-languages-world text-neutral-100"></i>
          <p className="text-center text-neutral-300">
            No languages added yet. Add your language skills and make your resume
            shine a little brighter!
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-space-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-space-3 max-sm:flex-col">
              <Input
                aria-label="Language"
                maxLength={L.name}
                value={item.name}
                onChange={(event) => dispatch(updateItem({ section: "languages", id: item.id, field: "name", value: event.target.value }))}
                {...field(`${item.id}.name`)}
              />
              <select
                aria-label={`Level of ${item.name || "this language"}`}
                value={item.level}
                onChange={(event) => dispatch(updateItem({ section: "languages", id: item.id, field: "level", value: event.target.value }))}
                className={`${SELECT} sm:max-w-44`}
              >
                <option value="">Level</option>
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label={`Remove ${item.name || "language"}`}
                onClick={() => dispatch(removeItem({ section: "languages", id: item.id }))}
                className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-red-500/5"
              >
                <i className="fi fi-rr-trash text-[20px] text-red-500/70" aria-hidden="true"></i>
              </button>
            </li>
          ))}
        </ul>
      )}

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

export default Language;
