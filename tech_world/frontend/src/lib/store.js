import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../redux/api/baseApi";
import authReducer from "../redux/slices/authSlice";

// Importing these registers their endpoints on `baseApi` via injectEndpoints.
// (Side-effect imports — nothing needs to be used from them here.)
import "../redux/api/authApi";
import "../redux/api/customerApi";
import "../redux/api/addressApi";
import "../redux/api/cardApi";
import "../redux/api/productApi";
import "../redux/api/reviewApi";
import "../redux/api/cartApi";
import "../redux/api/checkoutApi";
import "../redux/api/orderApi";
import "../redux/api/messageApi";
import "../redux/api/adminAuthApi";
import "../redux/api/adminCatalogApi";
import "../redux/api/adminProductApi";
import "../redux/api/adminDashboardApi";
import "../redux/api/wishlistApi";

/**
 * A FACTORY, not a singleton. Next.js App Router renders on the server per
 * request — a single shared store instance would leak data between users.
 * `StoreProvider.jsx` calls this once per app instance (via useRef) so each
 * browser session gets its own isolated store, which is the pattern the
 * Redux Toolkit team recommends for the App Router.
 */
export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

  // Enables refetchOnFocus / refetchOnReconnect behavior
  setupListeners(store.dispatch);

  return store;
};