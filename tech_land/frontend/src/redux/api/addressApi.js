import { baseApi } from "./baseApi";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyAddresses: builder.query({
      query: () => "/customer/addresses",
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((a) => ({ type: "Address", id: a._id })), { type: "Address", id: "LIST" }]
          : [{ type: "Address", id: "LIST" }],
    }),

    // fields: { apartmentNumber, buildingNumber, roadNumber, locality, area, city, postCode, country, isDefault? }
    addAddress: builder.mutation({
      query: (fields) => ({ url: "/customer/addresses", method: "POST", body: fields }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    updateAddress: builder.mutation({
      query: ({ addressId, ...fields }) => ({
        url: `/customer/addresses/${addressId}`,
        method: "PATCH",
        body: fields,
      }),
      invalidatesTags: (result, error, { addressId }) => [{ type: "Address", id: addressId }, { type: "Address", id: "LIST" }],
    }),

    deleteAddress: builder.mutation({
      query: (addressId) => ({ url: `/customer/addresses/${addressId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),
  }),
});

export const { useGetMyAddressesQuery, useAddAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } =
  addressApi;
