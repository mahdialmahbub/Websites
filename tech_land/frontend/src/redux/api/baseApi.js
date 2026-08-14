import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "../slices/authSlice";

/**
 * Base URL comes from env so it's easy to point at localhost in dev and your
 * real domain in production. Set this in `.env.local`:
 *   NEXT_PUBLIC_API_URL=http://localhost:5000/api
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * The backend sets httpOnly cookies (`customer_token` / `admin_token`) on
 * login, so `credentials: "include"` is what actually keeps the user logged
 * in across requests — no manual token handling needed for normal use.
 *
 * We ALSO read a token out of Redux (see authSlice) and attach it as a
 * Bearer header as a fallback. This matters for one specific case: Safari/iOS
 * can be strict about cross-site cookies in dev when your frontend and
 * backend run on different ports. If that ever bites you, this fallback
 * keeps auth working without changing anything else.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) headers.set("authorization", `Bearer ${token}`);

    // Don't set Content-Type for FormData bodies (image uploads) — the
    // browser needs to set it itself so the multipart boundary is correct.
    return headers;
  },
});

/**
 * Wraps the base query so that any 401 (session expired / not logged in)
 * automatically clears the client-side auth state. This stops the app from
 * showing "logged in" UI when the server has actually rejected the session.
 */
const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearAuth());
  }

  return result;
};

/**
 * Single RTK Query "api" instance. Every feature file (authApi, productApi,
 * cartApi, etc.) calls `baseApi.injectEndpoints({...})` instead of creating
 * its own `createApi` — this is the recommended pattern for larger apps
 * because it keeps one shared cache instead of fragmenting it.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: [
    "Profile",
    "Address",
    "Card",
    "Device",
    "SettingsSearch",
    "Product",
    "AdminProduct",
    "Review",
    "Cart",
    "Order",
    "AdminOrder",
    "Brand",
    "Category",
    "Badge",
    "Discount",
    "AdminCustomer",
    "Message",
    "Overview",
    "AdminProfile",
  ],
  endpoints: () => ({}),
});
