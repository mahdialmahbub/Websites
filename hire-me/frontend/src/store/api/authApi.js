import { resetBuilder } from '../builder/builderSlice';
import { baseApi } from './baseApi';

const post = (url) => (body) => ({ url, method: 'POST', body });

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Current user, or a 401 error when logged out. Use it to protect pages. */
    getMe: build.query({
      query: () => '/users/me',
      transformResponse: (data) => data.user,
      providesTags: ['Me'],
    }),

    /** Which social buttons to show: { google: boolean, linkedin: boolean } */
    getAuthProviders: build.query({ query: () => '/auth/providers' }),

    // body: { name, email, password }
    register: build.mutation({ query: post('/auth/register') }),

    // body: { email, otp }   -> logs the user in
    verifyEmail: build.mutation({ query: post('/auth/verify-email'), invalidatesTags: ['Me'] }),

    // body: { email, purpose: 'verify_email' | 'reset_password' }
    resendOtp: build.mutation({ query: post('/auth/resend-otp') }),

    // body: { email, password }   (error.code === 'EMAIL_NOT_VERIFIED' -> send the user to the OTP page)
    login: build.mutation({ query: post('/auth/login'), invalidatesTags: ['Me'] }),

    logout: build.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(baseApi.util.resetApiState());
          dispatch(resetBuilder()); // the next person on this browser must not inherit the draft
        }
      },
    }),

    // Password reset, 3 steps:
    forgotPassword: build.mutation({ query: post('/auth/forgot-password') }), //    { email }
    verifyResetOtp: build.mutation({ query: post('/auth/verify-reset-otp') }), //   { email, otp }
    resetPassword: build.mutation({ query: post('/auth/reset-password') }), //      { password }
  }),
});

export const {
  useGetMeQuery,
  useGetAuthProvidersQuery,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} = authApi;
