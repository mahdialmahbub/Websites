import { baseApi } from './baseApi';

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** The builder's "Template" dialog. Public endpoint: { templates: [{ slug, name, description, category }], category, pagination } */
    getBuilderTemplates: build.query({
      query: () => '/templates?limit=48',
      transformResponse: (data) => data.templates,
    }),
  }),
});

export const { useGetBuilderTemplatesQuery } = catalogApi;
