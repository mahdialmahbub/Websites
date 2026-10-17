import { baseApi } from './baseApi';

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Dashboard cards: [{ id, title, design, fullName, professionalTitle, photoUrl, completion, updatedAt }] */
    listResumes: build.query({
      query: () => '/resumes',
      transformResponse: (data) => data.resumes,
      providesTags: ['ResumeList'],
    }),

    getResume: build.query({
      query: (id) => `/resumes/${id}`,
      transformResponse: (data) => data.resume,
      providesTags: (_result, _error, id) => [{ type: 'Resume', id }],
    }),

    /**
     * arg: { title?, design?, clientDraftId?, ...sections }
     *  - {} or { design }                -> new resume pre-filled from the profile (dashboard "New resume")
     *  - { clientDraftId, ...sections }  -> create from a browser draft (done automatically by <BuilderSync />)
     * Resolves { resume, profile: { updatedSections } }.
     */
    createResume: build.mutation({
      query: (body) => ({ url: '/resumes', method: 'POST', body }),
      invalidatesTags: ['ResumeList', 'Profile'],
    }),

    /** "Update my profile from this resume" - non-empty sections of the resume win; resolves { updatedSections }. */
    syncProfile: build.mutation({
      query: (id) => ({ url: `/resumes/${id}/sync-profile`, method: 'POST' }),
      invalidatesTags: ['Profile'],
    }),

    /** arg: { id, hideContact? (default true), rotate? }. Resolves { enabled, slug, url, hideContact } - same link every time. */
    shareResume: build.mutation({
      query: ({ id, ...body }) => ({ url: `/resumes/${id}/share`, method: 'POST', body }),
      transformResponse: (data) => data.share,
      invalidatesTags: ['ResumeList'],
    }),

    unshareResume: build.mutation({
      query: (id) => ({ url: `/resumes/${id}/share`, method: 'DELETE' }),
      invalidatesTags: ['ResumeList'],
    }),

    /**
     * AUTOSAVE. arg: { id, revision?, ...changedSections }
     * Send only what changed, e.g. updateResume({ id, workExperience: [...] }).
     * Resolves with { revision, updatedAt }; pass that revision back on the next save to detect conflicts.
     */
    updateResume: build.mutation({
      query: ({ id, ...patch }) => ({ url: `/resumes/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: ['ResumeList'],
      async onQueryStarted({ id, revision: _sentRevision, ...patch }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Keep the cached resume in sync without refetching it.
          dispatch(
            resumeApi.util.updateQueryData('getResume', id, (draft) => {
              Object.assign(draft, patch, { revision: data.revision, updatedAt: data.updatedAt });
            }),
          );
        } catch {
          /* the component that called the mutation handles the error */
        }
      },
    }),

    duplicateResume: build.mutation({
      query: (id) => ({ url: `/resumes/${id}/duplicate`, method: 'POST' }),
      transformResponse: (data) => data.resume,
      invalidatesTags: ['ResumeList'],
    }),

    deleteResume: build.mutation({
      query: (id) => ({ url: `/resumes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ResumeList'],
    }),
  }),
});

export const {
  useListResumesQuery,
  useGetResumeQuery,
  useCreateResumeMutation,
  useSyncProfileMutation,
  useShareResumeMutation,
  useUnshareResumeMutation,
  useUpdateResumeMutation,
  useDuplicateResumeMutation,
  useDeleteResumeMutation,
} = resumeApi;
