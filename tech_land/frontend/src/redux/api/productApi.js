import { baseApi } from "./baseApi";

// Turns a params object into a clean query string, skipping empty values
const toQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return query ? `?${query}` : "";
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * params: { search, category, badge, status, sortBy, page, limit }
     * sortBy: "price_asc" | "price_desc" | "newest" | "rating"
     */
    getProducts: builder.query({
      query: (params) => `/products${toQueryString(params)}`,
      providesTags: (result) =>
        result?.data?.products
          ? [...result.data.products.map((p) => ({ type: "Product", id: p._id })), { type: "Product", id: "LIST" }]
          : [{ type: "Product", id: "LIST" }],
    }),

    /**
     * Product Details page. Pass the currently selected variants + quantity
     * so the returned `pricing` reflects exactly what's on screen:
     *   useGetProductByIdQuery({ id, variantIds: ["64f...", "64f..."], quantity: 2 })
     * Omit variantIds to get the product's default-selected variant pricing.
     */
    getProductById: builder.query({
      query: ({ id, variantIds, quantity }) =>
        `/products/${id}${toQueryString({
          variantIds: variantIds?.length ? variantIds.join(",") : undefined,
          quantity,
        })}`,
      providesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useLazyGetProductByIdQuery } = productApi;
