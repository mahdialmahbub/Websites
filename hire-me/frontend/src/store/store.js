import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import builderReducer from './builder/builderSlice';
import flowReducer from './flow/flowSlice';
import profileDraftReducer from './profile/profileDraftSlice';
import './api/aiApi';
import './api/authApi';
import './api/catalogApi';
import './api/profileApi';
import './api/resumeApi';
import './api/reviewApi';
import './api/uploadApi';

/** A factory (not a singleton): in the App Router every request/user needs its own store instance. */
export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      builder: builderReducer, // the resume draft: guest + logged-in
      profileDraft: profileDraftReducer, // the /profile/edit form (separate from the resume being built)
      flow: flowReducer, //       what happens after Generate: benefits -> review -> redirect
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
