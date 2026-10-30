"use client";

import { createContext, useContext } from "react";
import * as builder from "@/store/builder/builderSlice";
import * as profile from "@/store/profile/profileDraftSlice";

/**
 * The builder forms (personal information, jobs, education, skills ...) are used in two places:
 *   "builder"  -> they edit the resume being built      (state.builder)
 *   "profile"  -> they edit the profile on /profile/edit (state.profileDraft)
 * Wrap a page in <FormTarget.Provider value="profile"> and every form below it writes to the profile draft.
 * Outside a provider the target is "builder", so the builder page needs no change.
 */
export const FormTarget = createContext("builder");

const pickActions = (slice) => ({
  updateField: slice.updateField,
  setSection: slice.setSection,
  addItem: slice.addItem,
  updateItem: slice.updateItem,
  moveItem: slice.moveItem,
  removeItem: slice.removeItem,
  restoreItem: slice.restoreItem,
  addSkill: slice.addSkill,
  removeSkill: slice.removeSkill,
  markAttempted: slice.markAttempted,
});

const TARGETS = {
  builder: { stateKey: "builder", actions: pickActions(builder) },
  profile: { stateKey: "profileDraft", actions: pickActions(profile) },
};

/** { stateKey, actions } of the draft the forms below edit. */
export function useFormTarget() {
  return TARGETS[useContext(FormTarget)] ?? TARGETS.builder;
}
