import { baseApi } from "./baseApi";
import {
  setCustomerSession,
  setPendingTwoFactorEmail,
  clearAuth,
} from "../slices/authSlice";
import { buildFormData } from "../../utils/formData";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * body: { name, email, password, phone, dateOfBirth, gender, address: {...}, image? (File) }
     * multipart/form-data because of the optional profile image.
     */
    register: builder.mutation({
      query: (fields) => ({
        url: "/auth/register",
        method: "POST",
        body: buildFormData(fields),
      }),
    }),

    verifyRegistrationOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-registration-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),

    resendOtp: builder.mutation({
      // purpose: "EMAIL_VERIFICATION" | "LOGIN_2FA" | "FORGOT_PASSWORD"
      query: ({ email, purpose }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: { email, purpose },
      }),
    }),

    /**
     * If the account has 2FA enabled, the response is
     * { twoFactorRequired: true, email } and NO session is created yet —
     * call verifyLoginOtp next. Otherwise the response contains the
     * customer + token and the session is established immediately.
     */
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.twoFactorRequired) {
            dispatch(setPendingTwoFactorEmail(data.data.email));
          } else if (data?.data?.customer) {
            dispatch(
              setCustomerSession({
                customer: data.data.customer,
                token: data.data.token,
              }),
            );
          }
        } catch {
          // error surfaces via the mutation's own `error` state — nothing extra to do here
        }
      },
      invalidatesTags: (result, error) => (error ? [] : ["Profile"]),
    }),

    verifyLoginOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-login-otp",
        method: "POST",
        body: { email, otp },
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCustomerSession({
              customer: data.data.customer,
              token: data.data.token,
            }),
          );
        } catch {
          // handled by the caller via the mutation's error state
        }
      },
      invalidatesTags: ["Profile"],
    }),

    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearAuth());
        }
      },
      invalidatesTags: [
        "Profile",
        "Cart",
        "Order",
        "Address",
        "Card",
        "Device",
      ],
    }),

    /**
     * STEP 1 of forgot-password: body: { email }
     * Always resolves with a generic "OTP sent if account exists" message —
     * the backend never reveals whether the email is actually registered.
     * No session/state changes here, so no onQueryStarted needed.
     */
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    /**
     * STEP 2 of forgot-password: body: { email, otp }
     * Response: { resetToken } — a short-lived (10 min) token, NOT a session.
     * Keep it in component state on the frontend and pass it into
     * resetPassword next; don't persist it (no Redux state, no localStorage).
     */
    verifyForgotPasswordOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-forgot-password-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),

    /**
     * STEP 3 of forgot-password: body: { resetToken, newPassword, confirmPassword }
     * On success the backend logs the customer straight in on this device —
     * no 2FA OTP, even if the account has it enabled, since the FORGOT_PASSWORD
     * email OTP already proved identity. Response shape matches login/
     * verifyLoginOtp: { customer, token }.
     */
    resetPassword: builder.mutation({
      query: ({ resetToken, newPassword, confirmPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { resetToken, newPassword, confirmPassword },
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCustomerSession({
              customer: data.data.customer,
              token: data.data.token,
            }),
          );
        } catch {
          // handled by the caller via the mutation's error state
        }
      },
      invalidatesTags: [
        "Profile",
        "Cart",
        "Order",
        "Address",
        "Card",
        "Device",
      ],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyRegistrationOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi;
