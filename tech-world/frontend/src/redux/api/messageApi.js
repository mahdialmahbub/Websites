import { baseApi } from "./baseApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // fields: { name, email, message }
    sendMessage: builder.mutation({
      query: (fields) => ({ url: "/messages", method: "POST", body: fields }),
    }),
  }),
});

export const { useSendMessageMutation } = messageApi;
