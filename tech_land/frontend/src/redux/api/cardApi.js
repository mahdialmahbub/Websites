import { baseApi } from "./baseApi";

export const cardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCards: builder.query({
      query: () => "/customer/cards",
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((c) => ({ type: "Card", id: c._id })), { type: "Card", id: "LIST" }]
          : [{ type: "Card", id: "LIST" }],
    }),

    /**
     * STEP 1 of 2 — submit the new card's details, triggers an OTP email.
     * fields: { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv, billingAddress }
     * (cardNumber/cvv are only used server-side to compute a masked number — never stored raw)
     */
    requestAddCard: builder.mutation({
      query: (fields) => ({ url: "/customer/cards/request", method: "POST", body: fields }),
    }),

    /** STEP 2 of 2 — confirm with the OTP that arrived by email. */
    confirmAddCard: builder.mutation({
      query: (otp) => ({ url: "/customer/cards/confirm", method: "POST", body: { otp } }),
      invalidatesTags: [{ type: "Card", id: "LIST" }],
    }),

    deleteCard: builder.mutation({
      query: (cardId) => ({ url: `/customer/cards/${cardId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Card", id: "LIST" }],
    }),
  }),
});

export const { useGetMyCardsQuery, useRequestAddCardMutation, useConfirmAddCardMutation, useDeleteCardMutation } =
  cardApi;
