import { createSlice } from '@reduxjs/toolkit';

/**
 * What happens after "Generate", in this exact order:
 *
 *   share dialog closes
 *     guest        -> "benefits of logging in" dialog  (Login / Register / Maybe later)
 *     logged in    -> (skipped)
 *   review dialog   ALWAYS, after every generate
 *   review sent or skipped
 *     logged in    -> /my-resume          guest -> /create-resume
 *
 * A guest who picks Login / Register leaves the flow with a "pending review" saved in the browser;
 * after they are logged in the review dialog opens once and then they land on /my-resume.
 *
 * stage: 'idle' | 'benefits' | 'review'
 */
const initialState = { stage: 'idle', resumeId: null };

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    /** The share dialog was closed. payload: { resumeId, isGuest } */
    shareClosed(state, { payload: { resumeId, isGuest } }) {
      state.resumeId = resumeId;
      state.stage = isGuest ? 'benefits' : 'review';
    },
    /** "Maybe later" (or closing the benefits dialog): the review still comes. */
    benefitsDismissed(state) {
      if (state.stage === 'benefits') state.stage = 'review';
    },
    /** The guest went to log in / register: nothing is open now, the review is pending in the browser. */
    leftForLogin() {
      return initialState;
    },
    /** Logged in again with a pending review. payload: resumeId */
    resumePendingReview(state, { payload: resumeId }) {
      state.resumeId = resumeId;
      state.stage = 'review';
    },
    reviewFinished() {
      return initialState;
    },
  },
});

export const { shareClosed, benefitsDismissed, leftForLogin, resumePendingReview, reviewFinished } = flowSlice.actions;
export default flowSlice.reducer;
