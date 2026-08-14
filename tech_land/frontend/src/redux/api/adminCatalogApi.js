import { baseApi } from "./baseApi";

export const adminCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Brand ----------
    getBrands: builder.query({
      query: () => "/admin/brands",
      providesTags: ["Brand"],
    }),
    createBrand: builder.mutation({
      query: (fields) => ({ url: "/admin/brands", method: "POST", body: fields }), // { name, logo? }
      invalidatesTags: ["Brand"],
    }),

    // ---------- Category ----------
    getCategories: builder.query({
      query: () => "/admin/categories",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (fields) => ({ url: "/admin/categories", method: "POST", body: fields }), // { name, variantGroups?: [] }
      invalidatesTags: ["Category"],
    }),

    // ---------- Badge (persists permanently, reused as defaults on future products) ----------
    getBadges: builder.query({
      query: () => "/admin/badges",
      providesTags: ["Badge"],
    }),
    createBadge: builder.mutation({
      query: (name) => ({ url: "/admin/badges", method: "POST", body: { name } }),
      invalidatesTags: ["Badge"],
    }),

    // ---------- Discount tags (15%, 30% defaults + custom) ----------
    getDiscounts: builder.query({
      query: () => "/admin/discounts",
      providesTags: ["Discount"],
    }),
    createDiscount: builder.mutation({
      query: (percentage) => ({ url: "/admin/discounts", method: "POST", body: { percentage } }),
      invalidatesTags: ["Discount"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetBadgesQuery,
  useCreateBadgeMutation,
  useGetDiscountsQuery,
  useCreateDiscountMutation,
} = adminCatalogApi;
