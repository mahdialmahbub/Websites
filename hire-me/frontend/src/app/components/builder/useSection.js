"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateSection } from "@/resume/validation";
import { useFormTarget } from "./formTarget";

/**
 * Everything a builder form needs for one section:
 *   const { value, dispatch, field } = useSection("workExperience");
 *   <Input {...field(`${item.id}.jobTitle`)} ... />
 *
 * field(key) returns the props that show a field's error: validation, helperText and onBlur.
 * An error appears after the user leaves the field, or for the whole step once "Next" was pressed.
 */
export function useSection(section) {
  const dispatch = useDispatch();
  const { stateKey, actions } = useFormTarget(); // the resume being built, or the profile on /profile/edit
  const value = useSelector((state) => state[stateKey].content[section]);
  const attempted = useSelector((state) => Boolean(state[stateKey].attempted[section]));
  const errors = useMemo(() => validateSection(section, value), [section, value]);
  const [touched, setTouched] = useState(() => new Set());

  const touch = (key) => setTouched((previous) => (previous.has(key) ? previous : new Set(previous).add(key)));

  const field = (key) => {
    const message = errors[key];
    const show = Boolean(message) && (attempted || touched.has(key));
    return {
      validation: show ? "error" : "default",
      helperText: show ? message : undefined,
      onBlur: () => touch(key),
    };
  };

  const sectionError = attempted || touched.has("_") ? errors._ : undefined;
  return { value, dispatch, actions, field, errors, sectionError };
}
