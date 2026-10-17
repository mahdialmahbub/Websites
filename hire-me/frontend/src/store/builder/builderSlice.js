import { createSlice } from '@reduxjs/toolkit';
import {
  CONTENT_SECTIONS,
  PROFILE_SECTIONS,
  clearSaved,
  createDraft,
  createItem,
  isFieldEmpty,
  newId,
  sanitizeStored,
  touch,
} from './builderModel';

/**
 * @typedef {'idle'|'saving'|'saved'|'error'|'conflict'} SaveStatus
 * @typedef {'personalInformation'|'professionalSummary'|'workExperience'|'education'|'projects'|'skills'|'languages'|'references'|'targetJob'} Section
 * @typedef {'workExperience'|'education'|'projects'|'languages'|'references'} ListSection
 */

const initialState = {
  ...createDraft(),
  hydrated: false, // true once localStorage has been read (client only)
  status: 'idle', //  SaveStatus - drives the "Saving... / Saved" indicator
  error: null,
  notice: null, //    e.g. { type: 'profile-saved', sections: [...] } after a guest draft was claimed
};

const slice = createSlice({
  name: 'builder',
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

    /** List sections: addItem({ section: 'workExperience' }) */
    addItem(state, { payload: { section } }) {
      state.content[section].push(createItem(section));
      touch(state, section);
    },

    updateItem(state, { payload: { section, id, field, value } }) {
      const item = state.content[section].find((entry) => entry.id === id);
      if (!item) return;
      item[field] = value;
      touch(state, section);
    },

    removeItem(state, { payload: { section, id } }) {
      state.content[section] = state.content[section].filter((entry) => entry.id !== id);
      touch(state, section);
    },

    addSkill(state, { payload }) {
      const name = String(payload ?? '').trim();
      if (!name || state.content.skills.some((skill) => skill.toLowerCase() === name.toLowerCase())) return;
      state.content.skills.push(name);
      touch(state, 'skills');
    },

    removeSkill(state, { payload }) {
      state.content.skills = state.content.skills.filter((skill) => skill !== payload);
      touch(state, 'skills');
    },

    /** "Use This" / Template / Color pickers: setDesign({ templateId: 'modern' }) or setDesign({ color: '#2563eb' }) */
    setDesign(state, { payload }) {
      Object.assign(state.design, payload);
      touch(state, 'design');
    },

    setTitle(state, { payload }) {
      state.title = payload;
      touch(state, 'title');
    },

    /** Logged-in user opens a blank builder -> start from the profile. Only fills EMPTY sections, never marks dirty. */
    prefillFromProfile(state, { payload: profile }) {
      for (const section of PROFILE_SECTIONS) {
        if (isFieldEmpty(state.content[section]) && !isFieldEmpty(profile?.[section])) {
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
      for (const section of CONTENT_SECTIONS) if (resume[section] !== undefined) state.content[section] = resume[section];
      state.dirty = {};
      state.status = 'idle';
      state.error = null;
    },

    /** The draft was saved as a new server resume. */
    attachResume(state, { payload: { id, revision, ownerId, counters } }) {
      state.resumeId = id;
      state.revision = revision;
      state.ownerId = ownerId;
      clearSaved(state, counters);
      state.status = 'saved';
      state.error = null;
    },

    /** The stored resume belongs to another account (someone else logged in on this browser): treat as a fresh draft. */
    detachResume(state) {
      state.resumeId = null;
      state.revision = null;
      state.ownerId = null;
      state.draftId = newId();
      for (const section of CONTENT_SECTIONS) if (!isFieldEmpty(state.content[section])) touch(state, section);
    },

    markSaving(state) {
      state.status = 'saving';
      state.error = null;
    },
    markSaved(state, { payload: { revision, counters } }) {
      state.revision = revision;
      clearSaved(state, counters);
      state.status = 'saved';
      state.error = null;
    },
    markError(state, { payload }) {
      state.status = 'error';
      state.error = payload;
    },
    markConflict(state, { payload }) {
      state.status = 'conflict';
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
      Object.assign(state, createDraft(), { status: 'idle', error: null, notice: null });
    },
  },
});

export const {
  hydrateDraft, updateField, setSection, addItem, updateItem, removeItem, addSkill, removeSkill, setDesign, setTitle,
  prefillFromProfile, loadResume, attachResume, detachResume, markSaving, markSaved, markError, markConflict,
  setNotice, clearNotice, resetBuilder,
} = slice.actions;

export const selectBuilder = (state) => state.builder;
export const selectContent = (state) => state.builder.content;
export const selectDesign = (state) => state.builder.design;
export const selectSaveStatus = (state) => state.builder.status;

export default slice.reducer;
