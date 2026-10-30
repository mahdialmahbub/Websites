import { createSlice } from '@reduxjs/toolkit';
import { PROFILE_SECTIONS, createDraft } from '../builder/builderModel';
import { builderCaseReducers as edit } from '../builder/builderSlice';

/**
 * The draft of the PROFILE EDIT page (/profile/edit). It has the same shape and the same editing actions as the
 * builder draft, so the very same form components edit it, but it is a separate slice: editing the profile never
 * touches the resume you are building, and the profile is saved only when "Save changes" is pressed.
 * Profile changes affect only FUTURE auto-fill; saved resumes never change.
 */
const initialState = {
  content: createDraft().content,
  dirty: {}, //       { section: counter } - any key means "unsaved changes"
  attempted: {}, //   { section: true } - "Save" was pressed, so every error of that section shows
  loaded: false, //   true once the saved profile was copied into the draft
};

const slice = createSlice({
  name: 'profileDraft',
  initialState,
  reducers: {
    // the editing actions, shared with the builder
    updateField: edit.updateField,
    setSection: edit.setSection,
    addItem: edit.addItem,
    updateItem: edit.updateItem,
    moveItem: edit.moveItem,
    removeItem: edit.removeItem,
    addSkill: edit.addSkill,
    removeSkill: edit.removeSkill,
    markAttempted: edit.markAttempted,

    /** The saved profile arrived from the server: it becomes the (clean) draft. */
    profileLoaded(state, { payload: profile }) {
      const empty = createDraft().content;
      state.content = { ...empty };
      for (const section of PROFILE_SECTIONS) if (profile?.[section] !== undefined) state.content[section] = profile[section];
      state.dirty = {};
      state.attempted = {};
      state.loaded = true;
    },

    /** Saved: the draft is clean again. */
    profileSaved(state) {
      state.dirty = {};
      state.attempted = {};
    },

    /** Leaving the page / cancel: the next visit starts from the saved profile again. */
    profileDiscarded() {
      return initialState;
    },
  },
});

export const {
  updateField, setSection, addItem, updateItem, moveItem, removeItem, addSkill, removeSkill, markAttempted,
  profileLoaded, profileSaved, profileDiscarded,
} = slice.actions;

export default slice.reducer;
