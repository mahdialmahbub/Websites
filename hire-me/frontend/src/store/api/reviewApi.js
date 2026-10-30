import { baseApi } from './baseApi';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * arg: { resumeId, rating (1-5), comment?, guestName?, hpField? }  -> { review }
     * hpField is the hidden honeypot input: people leave it empty, bots fill it in (the server then drops the review silently).
     * Errors: RESUME_NOT_FOUND (404), RATE_LIMITED (429), VALIDATION_ERROR (400).
     */
    createReview: build.mutation({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
    }),
  }),
});

export const { useCreateReviewMutation } = reviewApi;
