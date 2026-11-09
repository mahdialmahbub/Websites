// redux/api/deliveryManApi.js

import { baseApi } from "./baseApi";

const toQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return query ? `?${query}` : "";
};

export const deliveryManApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // 1. DELIVERY MEN LIST
    // ==========================================
    getDeliveryMen: builder.query({
      query: (params) =>
        `/admin/delivery-men${toQueryString(params)}`,

      providesTags: (result) => {
        const deliveryMen = result?.data?.deliveryMen;

        if (!deliveryMen) {
          return [
            {
              type: "DeliveryMan",
              id: "LIST",
            },
          ];
        }

        return [
          ...deliveryMen.map((deliveryMan) => ({
            type: "DeliveryMan",
            id: deliveryMan._id,
          })),

          {
            type: "DeliveryMan",
            id: "LIST",
          },
        ];
      },
    }),

    // ==========================================
    // 2. DELIVERY MAN DETAILS
    // ==========================================
    getDeliveryManDetails: builder.query({
      query: (id) =>
        `/admin/delivery-men/${id}`,

      providesTags: (result, error, id) => [
        {
          type: "DeliveryMan",
          id,
        },
      ],
    }),

    // ==========================================
    // 3. ADD DELIVERY MAN
    // ==========================================
    addDeliveryMan: builder.mutation({
      query: (newDeliveryMan) => ({
        url: "/admin/delivery-men",
        method: "POST",
        body: newDeliveryMan,
      }),

      invalidatesTags: [
        {
          type: "DeliveryMan",
          id: "LIST",
        },
      ],
    }),

    // ==========================================
    // 4. UPDATE DELIVERY MAN
    // ==========================================
    updateDeliveryMan: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/delivery-men/${id}`,
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: (result, error, { id }) => [
        {
          type: "DeliveryMan",
          id,
        },
        {
          type: "DeliveryMan",
          id: "LIST",
        },
      ],
    }),

    // ==========================================
    // 5. UPDATE DELIVERY MAN STATUS
    // ==========================================
    updateDeliveryManStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/delivery-men/${id}/status`,
        method: "PATCH",
        body: { status },
      }),

      invalidatesTags: (result, error, { id }) => [
        {
          type: "DeliveryMan",
          id,
        },
        {
          type: "DeliveryMan",
          id: "LIST",
        },
      ],
    }),

    // ==========================================
    // 6. DELETE DELIVERY MAN
    // ==========================================
    deleteDeliveryMan: builder.mutation({
      query: (id) => ({
        url: `/admin/delivery-men/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, id) => [
        {
          type: "DeliveryMan",
          id,
        },
        {
          type: "DeliveryMan",
          id: "LIST",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetDeliveryMenQuery,
  useGetDeliveryManDetailsQuery,
  useAddDeliveryManMutation,
  useUpdateDeliveryManMutation,
  useUpdateDeliveryManStatusMutation,
  useDeleteDeliveryManMutation,
} = deliveryManApi;