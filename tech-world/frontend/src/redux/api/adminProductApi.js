import { baseApi } from "./baseApi";
import { buildFormData } from "../../utils/formData";

// Turns a params object into a clean query string, skipping empty values
const toQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return query ? `?${query}` : "";
};

export const adminProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * params: { status, category, sortBy, search, page, limit }
     * Unlike the public listing, this shows Paused products too (pass status to filter).
     */
    getProductsAdmin: builder.query({
      query: (params) => `/admin/products${toQueryString(params)}`,
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map((p) => ({ type: "AdminProduct", id: p._id })),
              { type: "AdminProduct", id: "LIST" },
            ]
          : [{ type: "AdminProduct", id: "LIST" }],
    }),

    /**
     * fields — the full Add New Product Form payload:
     * { title, description, brand, category, variants:[], colors:[], specifications:[],
     *   startingPrice, discountPercentage, badges:[], stock, guaranteeMonths, warrantyMonths,
     *   sellerPhone, images: File[] }
     */
    createProduct: builder.mutation({
      query: (fields) => ({ url: "/admin/products", method: "POST", body: buildFormData(fields) }),
      invalidatesTags: [{ type: "AdminProduct", id: "LIST" }, { type: "Product", id: "LIST" }],
    }),

    /** Same fields as createProduct, all optional. Pass `removeImageIds: []` to drop existing images. */
    updateProduct: builder.mutation({
      query: ({ id, ...fields }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: buildFormData(fields),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminProduct", id },
        { type: "AdminProduct", id: "LIST" },
        { type: "Product", id },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/admin/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "AdminProduct", id: "LIST" }, { type: "Product", id: "LIST" }],
    }),

    /** Reviews can only be deleted from the Edit Product page. */
    deleteReview: builder.mutation({
      query: (reviewId) => ({ url: `/admin/reviews/${reviewId}`, method: "DELETE" }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetProductsAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteReviewMutation,
} = adminProductApi;
