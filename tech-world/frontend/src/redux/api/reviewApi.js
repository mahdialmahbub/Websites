import { baseApi } from "./baseApi";
import { buildFormData } from "../../utils/formData";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: (productId) => `/products/${productId}/reviews`,
      providesTags: (result, error, productId) => [{ type: "Review", id: productId }],
    }),

    /**
     * fields: { productId, orderId, rating, text, images?: File[] }
     * `orderId` must be an order that actually contains this product — the
     * backend verifies the purchase before accepting the review, and marks
     * that specific order item as reviewed.
     *
     * Invalidates "Order" (not just Review/Product) so `useGetMyDeliveredOrdersQuery`
     * refetches afterward and the item's `isReviewed` flag — which the
     * Review button's visibility depends on — comes back updated.
     */
    addReview: builder.mutation({
      query: ({ productId, ...fields }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body: buildFormData(fields),
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Review", id: productId },
        { type: "Product", id: productId },
        "Order",
      ],
    }),
  }),
});

export const { useGetProductReviewsQuery, useAddReviewMutation } = reviewApi;