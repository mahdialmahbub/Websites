import { baseApi } from "./baseApi";
import { setAdminSession, clearAuth } from "../slices/authSlice";

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({ url: "/admin/auth/login", method: "POST", body: credentials }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdminSession({ admin: data.data.admin, token: data.data.token }));
        } catch {
          // handled via the mutation's error state
        }
      },
      invalidatesTags: ["AdminProfile"],
    }),

    getMyAdminProfile: builder.query({
      query: () => "/admin/auth/me",
      providesTags: ["AdminProfile"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdminSession({ admin: data.data }));
        } catch {
          // not logged in — normal
        }
      },
    }),

    adminLogout: builder.mutation({
      query: () => ({ url: "/admin/auth/logout", method: "POST" }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearAuth());
        }
      },
      invalidatesTags: ["AdminProfile"],
    }),
  }),
});

export const { useAdminLoginMutation, useGetMyAdminProfileQuery, useAdminLogoutMutation } = adminAuthApi;
