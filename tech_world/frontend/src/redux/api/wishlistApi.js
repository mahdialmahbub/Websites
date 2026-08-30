import { baseApi } from "./baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyWishlist: builder.query({
      query: () => "/customer/wishlist",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p) => ({
                type: "Product",
                id: `wishlist-${p._id}`,
              })),
              { type: "Product", id: "WISHLIST" },
            ]
          : [{ type: "Product", id: "WISHLIST" }],
    }),

    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/customer/wishlist/${productId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Product", id: "WISHLIST" }],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/customer/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "WISHLIST" }],
    }),
  }),
});

export const {
  useGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
