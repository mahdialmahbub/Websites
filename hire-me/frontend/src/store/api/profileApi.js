import { baseApi } from './baseApi';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * The user's reusable data - the same 8 sections as the builder:
     * { personalInformation, professionalSummary, workExperience, education, projects, skills, languages, references, updatedAt }
     * Name and e-mail fall back to the account, so a brand-new user already gets those pre-filled.
     */
    getProfile: build.query({
      query: () => '/profile',
      transformResponse: (data) => data.profile,
      providesTags: ['Profile'],
    }),

    /** For the profile page: send only the sections that changed, e.g. updateProfile({ skills: ['React'] }). */
    updateProfile: build.mutation({
      query: (body) => ({ url: '/profile', method: 'PATCH', body }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
