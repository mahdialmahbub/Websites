"use client";

import React from "react";
import { Input } from "../Input";
import EntryList from "./EntryList";
import { useSection } from "./useSection";
import { LIMITS } from "@/resume/validation";

const L = LIMITS.references;

const Reference = () => {
  const { value: items, dispatch, actions, field, sectionError } = useSection("references");
  const { updateItem } = actions;

  return (
    <EntryList
      section="references"
      label="reference"
      items={items}
      max={L.max}
      dispatch={dispatch}
      sectionError={sectionError}
      renderEntry={(item) => {
        const set = (key) => (event) => dispatch(updateItem({ section: "references", id: item.id, field: key, value: event.target.value }));
        const f = (key) => field(`${item.id}.${key}`);
        return (
          <>
            <Input label="Reference Name" placeholder="Sarah Ahmed" requiredLabel maxLength={L.name} value={item.name} onChange={set("name")} {...f("name")} />
            <Input label="Job Title" placeholder="Senior Software Engineer" maxLength={L.jobTitle} value={item.jobTitle} onChange={set("jobTitle")} {...f("jobTitle")} />
            <Input label="Company / Organization" placeholder="ABC Technologies Ltd." maxLength={L.company} value={item.company} onChange={set("company")} {...f("company")} />
            <Input label="Relationship" placeholder="Former Manager" maxLength={L.relationship} value={item.relationship} onChange={set("relationship")} {...f("relationship")} />
            <Input label="Email Address" type="email" placeholder="sarah.ahmed@example.com" maxLength={LIMITS.email} value={item.email} onChange={set("email")} {...f("email")} />
            <Input label="Phone Number" type="tel" placeholder="+880 17XXX XXXXX" maxLength={L.phone} value={item.phone} onChange={set("phone")} {...f("phone")} />
          </>
        );
      }}
    />
  );
};

export default Reference;
