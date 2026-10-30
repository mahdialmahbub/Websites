import { baseApi } from './baseApi';

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * "My resumes": one page of the user's resumes, newest first. arg: { page = 1, limit = 12 }
     * -> { resumes: [{ id, title, templateName, design, fullName, professionalTitle, completion, atsScore, status,
     *                  shared, shareUrl, createdAt, updatedAt }], pagination: { page, limit, total, totalPages } }
     */
    listResumes: build.query({
      query: ({ page = 1, limit = 12 } = {}) => `/resumes?page=${page}&limit=${limit}`,
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

    /**
     * "Generate": the server validates the resume, finalizes it and returns the SAME share link every time (double click safe).
     * arg: { id, hideContact? } -> { resume, share: { enabled, slug, url, hideContact }, profile: { updatedSections } }
     * A VALIDATION_ERROR answer carries details.fieldErrors ({ 'personalInformation.email': ['...'] }).
     */
    generateResume: build.mutation({
      query: ({ id, ...body }) => ({ url: `/resumes/${id}/generate`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => ['ResumeList', 'Profile', { type: 'Resume', id }],
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

    /**
     * Guest -> account. The server already claims the guest's resumes at login; this call also hands over the
     * latest data from the browser (localStorage) so it tops up the profile. Idempotent.
     * arg: { draft? } -> { claimed, updatedSections }
     */
    claimGuestData: build.mutation({
      query: (body) => ({ url: '/resumes/claim', method: 'POST', body }),
      invalidatesTags: ['ResumeList', 'Profile'],
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
  useLazyGetResumeQuery,
  useCreateResumeMutation,
  useSyncProfileMutation,
  useShareResumeMutation,
  useUnshareResumeMutation,
  useUpdateResumeMutation,
  useClaimGuestDataMutation,
  useDuplicateResumeMutation,
  useGenerateResumeMutation,
  useDeleteResumeMutation,
} = resumeApi;
