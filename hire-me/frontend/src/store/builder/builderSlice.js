import { createSlice } from "@reduxjs/toolkit";
import {
  CONTENT_SECTIONS,
  PROFILE_SECTIONS,
  clearSaved,
  createDraft,
  createItem,
  isFieldEmpty,
  moveInList,
  newId,
  sanitizeStored,
  touch,
} from "./builderModel";

/**
 * @typedef {'idle'|'saving'|'saved'|'error'|'conflict'} SaveStatus
 * @typedef {'personalInformation'|'professionalSummary'|'workExperience'|'education'|'projects'|'skills'|'languages'|'references'|'targetJob'} Section
 * @typedef {'workExperience'|'education'|'projects'|'languages'|'references'} ListSection
 */

const initialState = {
  ...createDraft(),
  hydrated: false, // true once localStorage has been read (client only)
  status: "idle", //  SaveStatus - drives the "Saving... / Saved" indicator
  error: null,
  notice: null, //    e.g. { type: 'profile-saved', sections: [...] } after a guest draft was claimed
  attempted: {}, //   { section: true } - "Next" was pressed on that step, so all its errors are shown (never saved)
};

const slice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    hydrateDraft(state, { payload }) {
      Object.assign(state, sanitizeStored(payload));
      state.hydrated = true;
    },

    /** Object sections: updateField({ section: 'personalInformation', field: 'fullName', value: 'Rahim' }) */
    updateField(state, { payload: { section, field, value } }) {
      state.content[section][field] = value;
      touch(state, section);
    },

    /** Whole-section values: setSection({ section: 'professionalSummary', value: '...' }) or skills: ['js'] */
    setSection(state, { payload: { section, value } }) {
      state.content[section] = value;
      touch(state, section);
    },

    /** List sections: addItem({ section: 'workExperience' }) or with starting values: addItem({ section: 'languages', values: { name: 'English' } }) */
    addItem(state, { payload: { section, values } }) {
      state.content[section].push({
        ...createItem(section),
        ...(values ?? {}),
      });
      touch(state, section);
    },

    updateItem(state, { payload: { section, id, field, value } }) {
      const item = state.content[section].find((entry) => entry.id === id);
      if (!item) return;
      item[field] = value;
      touch(state, section);
    },

    /** Reorder: moveItem({ section: 'workExperience', id, direction: -1 | 1 }) */
    moveItem(state, { payload: { section, id, direction } }) {
      const moved = moveInList(state.content[section], id, direction);
      if (moved === state.content[section]) return;
      state.content[section] = moved;
      touch(state, section);
    },

    removeItem(state, { payload: { section, id } }) {
      state.content[section] = state.content[section].filter(
        (entry) => entry.id !== id,
      );
      touch(state, section);
    },

    restoreItem(state, { payload: { section, item, index, max } }) {
  const list = state.content[section];
  if (list.some((entry) => entry.id === item.id)) return; // already back
  if (max && list.length >= max) return; // the list got full again
  list.splice(Math.min(index, list.length), 0, item);
  touch(state, section); // same as removeItem: so autosave saves the restored entry
},

    addSkill(state, { payload }) {
      const name = String(payload ?? "").trim();
      if (
        !name ||
        state.content.skills.some(
          (skill) => skill.toLowerCase() === name.toLowerCase(),
        )
      )
        return;
      state.content.skills.push(name);
      touch(state, "skills");
    },

    removeSkill(state, { payload }) {
      state.content.skills = state.content.skills.filter(
        (skill) => skill !== payload,
      );
      touch(state, "skills");
    },

    /** "Use This" / Template / Color pickers: setDesign({ templateId: 'modern' }) or setDesign({ color: '#2563eb' }) */
    setDesign(state, { payload }) {
      Object.assign(state.design, payload);
      touch(state, "design");
    },

    /**
     * Sets the design WITHOUT marking it as changed. Used when the builder opens from "Use This" (a template
     * chosen on the templates page): opening the builder must never create a resume by itself.
     */
    presetDesign(state, { payload }) {
      Object.assign(state.design, payload);
    },

    /** The server resume was claimed by the account at login: from now on the user owns it. */
    adoptOwner(state, { payload: ownerId }) {
      state.ownerId = ownerId;
    },

    /** Sets the resume title WITHOUT marking it as changed (a title typed on /create-resume must not create a resume by itself). */
    presetTitle(state, { payload }) {
      state.title = String(payload ?? "").slice(0, 100);
    },

    markAttempted(state, { payload: section }) {
      state.attempted[section] = true;
    },

    setTitle(state, { payload }) {
      state.title = payload;
      touch(state, "title");
    },

    /** Logged-in user opens a blank builder -> start from the profile. Only fills EMPTY sections, never marks dirty. */
    prefillFromProfile(state, { payload: profile }) {
      for (const section of PROFILE_SECTIONS) {
        if (
          isFieldEmpty(state.content[section]) &&
          !isFieldEmpty(profile?.[section])
        ) {
          state.content[section] = profile[section];
        }
      }
    },

    /** Replace the draft with a resume loaded from the server (opening an existing resume). */
    loadResume(state, { payload: { resume, ownerId } }) {
      const base = createDraft();
      state.draftId = base.draftId;
      state.resumeId = resume.id;
      state.ownerId = ownerId;
      state.revision = resume.revision;
      state.title = resume.title;
      state.design = { ...base.design, ...(resume.design ?? {}) };
      state.content = { ...base.content };
      for (const section of CONTENT_SECTIONS)
        if (resume[section] !== undefined)
          state.content[section] = resume[section];
      state.dirty = {};
      state.status = "idle";
      state.error = null;
    },

    /** The draft was saved as a new server resume. */
    attachResume(state, { payload: { id, revision, ownerId, counters } }) {
      state.resumeId = id;
      state.revision = revision;
      state.ownerId = ownerId;
      clearSaved(state, counters);
      state.status = "saved";
      state.error = null;
    },

    /** The stored resume belongs to another account (someone else logged in on this browser): treat as a fresh draft. */
    detachResume(state) {
      state.resumeId = null;
      state.revision = null;
      state.ownerId = null;
      state.draftId = newId();
      for (const section of CONTENT_SECTIONS)
        if (!isFieldEmpty(state.content[section])) touch(state, section);
    },

    markSaving(state) {
      state.status = "saving";
      state.error = null;
    },
    markSaved(state, { payload: { revision, counters } }) {
      state.revision = revision;
      clearSaved(state, counters);
      state.status = "saved";
      state.error = null;
    },
    markError(state, { payload }) {
      state.status = "error";
      state.error = payload;
    },
    markConflict(state, { payload }) {
      state.status = "conflict";
      state.error = payload;
    },

    setNotice(state, { payload }) {
      state.notice = payload;
    },
    clearNotice(state) {
      state.notice = null;
    },

    /** Start over: logout, or the dashboard's "New resume". */
    resetBuilder(state) {
      Object.assign(state, createDraft(), {
        status: "idle",
        error: null,
        notice: null,
        attempted: {},
      });
    },
  },
});

export const {
  hydrateDraft,
  updateField,
  setSection,
  addItem,
  updateItem,
  moveItem,
  removeItem,
  restoreItem,
  addSkill,
  removeSkill,
  setDesign,
  setTitle,
  prefillFromProfile,
  presetDesign,
  presetTitle,
  adoptOwner,
  markAttempted,
  loadResume,
  attachResume,
  detachResume,
  markSaving,
  markSaved,
  markError,
  markConflict,
  setNotice,
  clearNotice,
  resetBuilder,
} = slice.actions;

/** The same reducer functions, for other slices that edit the 8 resume sections (the profile editor). */
export const builderCaseReducers = slice.caseReducers;

export const selectBuilder = (state) => state.builder;
export const selectContent = (state) => state.builder.content;
export const selectDesign = (state) => state.builder.design;
export const selectSaveStatus = (state) => state.builder.status;

export default slice.reducer;
