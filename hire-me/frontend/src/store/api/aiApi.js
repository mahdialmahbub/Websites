import { baseApi } from './baseApi';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * "Improve with AI". arg: { field, text, context } (build it with buildAiRequest in resume/aiContext.js).
     * Resolves { text, mode: 'improve' | 'generate', field }. Errors carry a message that is safe to show:
     * NOT_ENOUGH_INFO (422), RATE_LIMITED (429), AI_UNAVAILABLE / AI_BUSY (503), AI_TIMEOUT (504), AI_BAD_OUTPUT (502).
     */
    enhanceText: build.mutation({
      query: (body) => ({ url: '/ai/enhance', method: 'POST', body }),
    }),

    /**
     * Keyword ideas for the Skills step. arg: { professionalTitle, targetJobTitle?, skills } -> { keywords: string[], role }
     * They are only suggestions: the person clicks the ones they really have.
     */
    suggestKeywords: build.mutation({
      query: (body) => ({ url: '/ai/keywords', method: 'POST', body }),
    }),
  }),
});

export const { useEnhanceTextMutation, useSuggestKeywordsMutation } = aiApi;
