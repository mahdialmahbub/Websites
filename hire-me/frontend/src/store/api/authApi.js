import { resetBuilder } from "../builder/builderSlice";
import { baseApi } from "./baseApi";

const post = (url) => (body) => ({ url, method: "POST", body });

// The next person on this browser must not inherit the cached user or the resume draft.
const clearClientState = (dispatch) => {
  dispatch(baseApi.util.resetApiState());
  dispatch(resetBuilder());
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Current user, or a 401 error when logged out.
     * Use it ONLY on protected pages (dashboard, editor, ...) to guard them.
     * Every 401 is logged to the browser console (hurts the Lighthouse Best Practices
     * score), so do not call this on public pages: use getSession there.
     */
    getMe: build.query({
      query: () => "/users/me",
      transformResponse: (data) => data?.user ?? null,
      providesTags: ["Me"],
    }),

    /**
     * Same user, but never a 401: the backend answers 200 { user: null } when logged out.
     * Use it on public pages / navbar to show "Log in" or the avatar.
     * Backend route needed: GET /auth/session  ->  200 { user: {...} | null }
     */
    getSession: build.query({
      query: () => "/auth/session",
      transformResponse: (data) => data?.user ?? null,
      providesTags: ["Me"],
    }),

    /** Which social buttons to show: { google: boolean, linkedin: boolean } */
    getAuthProviders: build.query({ query: () => "/auth/providers" }),

    // body: { name, email, password }
    register: build.mutation({ query: post("/auth/register") }),

    // body: { email, otp }   -> logs the user in
    verifyEmail: build.mutation({
      query: post("/auth/verify-email"),
      invalidatesTags: ["Me"],
    }),

    // body: { email, purpose: 'verify_email' | 'reset_password' }
    resendOtp: build.mutation({ query: post("/auth/resend-otp") }),

    // body: { email, password }   (error.code === 'EMAIL_NOT_VERIFIED' -> send the user to the OTP page)
    login: build.mutation({
      query: post("/auth/login"),
      invalidatesTags: ["Me"],
    }),

    logout: build.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // The caller handles the error (unwrap). Swallowing it here avoids an
          // "Uncaught (in promise)" console error; we still clear local state below.
        } finally {
          clearClientState(dispatch);
        }
      },
    }),

    // no body. Emails a code to the logged-in user. Call again to resend.
    requestDeleteAccount: build.mutation({
      query: () => ({ url: "/auth/delete-account/request", method: "POST" }),
    }),

    // body: { otp }  -> backend verifies the code, deletes the account and ends the session
    deleteAccount: build.mutation({
      query: post("/auth/delete-account"),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Account is gone and the session ended: drop the cached user and the draft too.
          clearClientState(dispatch);
        } catch {
          // Wrong code etc.: the caller shows the error, nothing to clear.
        }
      },
    }),

    // Password reset, 3 steps:
    forgotPassword: build.mutation({ query: post("/auth/forgot-password") }), //    { email }
    verifyResetOtp: build.mutation({ query: post("/auth/verify-reset-otp") }), //   { email, otp }
    resetPassword: build.mutation({ query: post("/auth/reset-password") }), //      { password }
  }),
});

export const {
  useGetMeQuery,
  useGetSessionQuery,
  useGetAuthProvidersQuery,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useRequestDeleteAccountMutation,
  useDeleteAccountMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} = authApi;
