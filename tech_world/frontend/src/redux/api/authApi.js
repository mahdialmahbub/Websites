import { baseApi } from "./baseApi";
import { setCustomerSession, setPendingTwoFactorEmail, clearAuth } from "../slices/authSlice";
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
      // purpose: "EMAIL_VERIFICATION" | "LOGIN_2FA"
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
            dispatch(setCustomerSession({ customer: data.data.customer, token: data.data.token }));
          }
        } catch {
          // error surfaces via the mutation's own `error` state — nothing extra to do here
        }
      },
      invalidatesTags: (result, error) => (error ? [] : ['Profile']),
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
          dispatch(setCustomerSession({ customer: data.data.customer, token: data.data.token }));
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
      invalidatesTags: ["Profile", "Cart", "Order", "Address", "Card", "Device"],
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
} = authApi;
