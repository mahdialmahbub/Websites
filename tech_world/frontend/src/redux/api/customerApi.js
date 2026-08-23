import { baseApi } from "./baseApi";
import { setCustomerSession } from "../slices/authSlice";
import { buildFormData } from "../../utils/formData";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Call this once on app load (e.g. in a top-level layout effect) to
     * hydrate the logged-in customer from the httpOnly cookie session.
     */
    getMyProfile: builder.query({
      query: () => "/customer/profile",
      providesTags: ["Profile"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCustomerSession({ customer: data.data }));
        } catch {
          // not logged in / session expired — normal, nothing to do
        }
      },
    }),

    // fields: { name?, phone?, dateOfBirth?, gender?, address?, isNotificationEnabled?, image? (File) }
    updateMyProfile: builder.mutation({
      query: (fields) => ({
        url: "/customer/profile",
        method: "PATCH",
        body: buildFormData(fields),
      }),
      invalidatesTags: ["Profile"],
    }),

    searchSettings: builder.query({
      query: (q) => `/customer/settings/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
      providesTags: ["SettingsSearch"],
    }),

    // ---------- Delete Account (OTP flow) ----------
    requestDeleteAccount: builder.mutation({
      query: () => ({ url: "/customer/account/delete/request", method: "POST" }),
    }),
    confirmDeleteAccount: builder.mutation({
      query: (otp) => ({ url: "/customer/account/delete/confirm", method: "POST", body: { otp } }),
    }),

    // ---------- Change Password (OTP flow) ----------
    requestChangePassword: builder.mutation({
      query: () => ({ url: "/customer/password/change/request", method: "POST" }),
    }),
    confirmChangePassword: builder.mutation({
      query: ({ otp, newPassword }) => ({
        url: "/customer/password/change/confirm",
        method: "POST",
        body: { otp, newPassword },
      }),
    }),

    // ---------- Two-Factor Verification ----------
    toggleTwoFactor: builder.mutation({
      query: (enabled) => ({ url: "/customer/two-factor", method: "PATCH", body: { enabled } }),
      invalidatesTags: ["Profile"],
    }),

    // ---------- Logged-in Devices ----------
    getMyDevices: builder.query({
      query: () => "/customer/devices",
      providesTags: ["Device"],
    }),
    logoutDevice: builder.mutation({
      query: (deviceId) => ({ url: `/customer/devices/${deviceId}`, method: "DELETE" }),
      invalidatesTags: ["Device"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useSearchSettingsQuery,
  useRequestDeleteAccountMutation,
  useConfirmDeleteAccountMutation,
  useRequestChangePasswordMutation,
  useConfirmChangePasswordMutation,
  useToggleTwoFactorMutation,
  useGetMyDevicesQuery,
  useLogoutDeviceMutation,
} = customerApi;
