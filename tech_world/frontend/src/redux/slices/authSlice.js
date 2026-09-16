import { createSlice } from "@reduxjs/toolkit";

/**
 * This slice deliberately stays small. The real source of truth for "am I
 * logged in and who am I" is the server (via the httpOnly cookie + the
 * `getMyProfile` / `getMyAdminProfile` RTK Query endpoints) — we don't
 * duplicate that here to avoid the two ever getting out of sync.
 *
 * What DOES live here:
 *  - `customer` / `admin`: a cached snapshot set right after login/register
 *    so the UI can render instantly, before the profile query resolves.
 *  - `token`: optional, only used as a Bearer-header fallback (see baseApi).
 *  - `pendingTwoFactorEmail`: tracks the in-progress "enter your OTP" step
 *    of the login flow.
 */
const initialState = {
  customer: null,
  admin: null,
  token: null,
  pendingTwoFactorEmail: null, // set while waiting for a login OTP
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCustomerSession(state, action) {
      state.customer = action.payload.customer;
      state.token = action.payload.token || null;
      state.pendingTwoFactorEmail = null;
    },
    setAdminSession(state, action) {
      state.admin = action.payload.admin;
      state.token = action.payload.token || null;
    },
    setPendingTwoFactorEmail(state, action) {
      state.pendingTwoFactorEmail = action.payload;
    },
    clearPendingTwoFactorEmail: (state) => {
      state.pendingTwoFactorEmail = null;
    },
    clearAuth(state) {
      state.customer = null;
      state.admin = null;
      state.token = null;
      state.pendingTwoFactorEmail = null;
    },
  },
});

export const {
  setCustomerSession,
  setAdminSession,
  setPendingTwoFactorEmail,
  clearPendingTwoFactorEmail,
  clearAuth,
} = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentCustomer = (state) => state.auth.customer;
export const selectCurrentAdmin = (state) => state.auth.admin;
export const selectIsAuthenticated = (state) => !!state.auth.customer;
export const selectIsAdminAuthenticated = (state) => !!state.auth.admin;
export const selectPendingTwoFactorEmail = (state) =>
  state.auth.pendingTwoFactorEmail;
