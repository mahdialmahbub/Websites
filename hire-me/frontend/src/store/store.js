import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import builderReducer from './builder/builderSlice';
import './api/authApi';
import './api/profileApi';
import './api/resumeApi';
import './api/uploadApi';

/** A factory (not a singleton): in the App Router every request/user needs its own store instance. */
export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      builder: builderReducer, // the resume draft: guest + logged-in
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
