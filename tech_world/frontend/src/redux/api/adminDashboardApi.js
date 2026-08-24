import { baseApi } from "./baseApi";

const toQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return query ? `?${query}` : "";
};

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- 1. Dashboard Overview ----------
    getOverviewStats: builder.query({
      query: () => "/admin/dashboard/overview",
      providesTags: ["Overview"],
    }),

    // ---------- 2. Orders (Dashboard/Orders + the Pending Orders widget via params.status) ----------
    /** params: { status, paymentMethod, sortByPrice, search, page, limit } */
    getOrdersAdmin: builder.query({
      query: (params) => `/admin/orders${toQueryString(params)}`,
      providesTags: (result) =>
        result?.data?.orders
          ? [...result.data.orders.map((o) => ({ type: "AdminOrder", id: o._id })), { type: "AdminOrder", id: "LIST" }]
          : [{ type: "AdminOrder", id: "LIST" }],
    }),

    getOrderDetailsAdmin: builder.query({
      query: ({orderId}) => `/admin/orders/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: "AdminOrder", id: orderId }],
    }),

    /** fields: { status?, trackingId?, courierName?, estimatedDeliveryDate? } — advances the status timeline */
    updateOrderStatusAdmin: builder.mutation({
      query: ({ orderId, ...fields }) => ({
        url: `/admin/orders/${orderId}`,
        method: "PATCH",
        body: fields,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "AdminOrder", id: orderId },
        { type: "AdminOrder", id: "LIST" },
        "Overview",
      ],
    }),

    deleteOrderAdmin: builder.mutation({
      query: (orderId) => ({ url: `/admin/orders/${orderId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "AdminOrder", id: "LIST" }, "Overview"],
    }),

    downloadInvoiceAdmin: builder.mutation({
      query: (orderId) => ({
        url: `/admin/orders/${orderId}/invoice`,
        method: "GET",
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    // ---------- 3 & Dashboard/Customers ----------
    /** params: { sortBy, paymentMethod, search, page, limit } */
    getCustomersAdmin: builder.query({
      query: (params) => `/admin/customers${toQueryString(params)}`,
      providesTags: (result) =>
        result?.data?.customers
          ? [
              ...result.data.customers.map((c) => ({ type: "AdminCustomer", id: c._id })),
              { type: "AdminCustomer", id: "LIST" },
            ]
          : [{ type: "AdminCustomer", id: "LIST" }],
    }),

    getCustomerDetailsAdmin: builder.query({
      query: (customerId) => `/admin/customers/${customerId}`,
      providesTags: (result, error, customerId) => [{ type: "AdminCustomer", id: customerId }],
    }),

    deleteCustomerAdmin: builder.mutation({
      query: (customerId) => ({ url: `/admin/customers/${customerId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "AdminCustomer", id: "LIST" }, "Overview"],
    }),

    // ---------- Dashboard/Messages ----------
    /** params: { search, page, limit } — search matches customer name, email, or message content */
    getMessagesAdmin: builder.query({
      query: (params) => `/admin/messages${toQueryString(params)}`,
      providesTags: (result) =>
        result?.data?.messages
          ? [...result.data.messages.map((m) => ({ type: "Message", id: m._id })), { type: "Message", id: "LIST" }]
          : [{ type: "Message", id: "LIST" }],
    }),

    getMessageDetailsAdmin: builder.query({
      query: (messageId) => `/admin/messages/${messageId}`,
      providesTags: (result, error, messageId) => [{ type: "Message", id: messageId }],
    }),
  }),
});

export const {
  useGetOverviewStatsQuery,
  useGetOrdersAdminQuery,
  useGetOrderDetailsAdminQuery,
  useUpdateOrderStatusAdminMutation,
  useDeleteOrderAdminMutation,
  useDownloadInvoiceAdminMutation,
  useGetCustomersAdminQuery,
  useGetCustomerDetailsAdminQuery,
  useDeleteCustomerAdminMutation,
  useGetMessagesAdminQuery,
  useGetMessageDetailsAdminQuery,
} = adminDashboardApi;
