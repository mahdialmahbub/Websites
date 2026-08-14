import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    /**
     * fields: { productId, selectedVariantIds: [], selectedColor, quantity }
     * Used for BOTH "Add to Cart" and "Buy Now" buttons — for Buy Now, call
     * this then `router.push("/cart")` on success (see README for the
     * exact component snippet).
     */
    addToCart: builder.mutation({
      query: (fields) => ({ url: "/cart/items", method: "POST", body: fields }),
      invalidatesTags: ["Cart"],
    }),

    // fields: { cartItemId, selectedVariantIds?, selectedColor?, quantity? }
    updateCartItem: builder.mutation({
      query: ({ cartItemId, ...fields }) => ({
        url: `/cart/items/${cartItemId}`,
        method: "PATCH",
        body: fields,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation({
      query: (cartItemId) => ({ url: `/cart/items/${cartItemId}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useGetMyCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveCartItemMutation } =
  cartApi;
