import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPendingOrders: builder.query({
      query: () => "/orders/pending",
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((o) => ({ type: "Order", id: o._id })), { type: "Order", id: "PENDING_LIST" }]
          : [{ type: "Order", id: "PENDING_LIST" }],
    }),

    getMyDeliveredOrders: builder.query({
      query: () => "/orders/delivered",
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((o) => ({ type: "Order", id: o._id })), { type: "Order", id: "DELIVERED_LIST" }]
          : [{ type: "Order", id: "DELIVERED_LIST" }],
    }),

    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: "Order", id: orderId }],
    }),

    /** Soft-cancel — only allowed before the order reaches "Shipped". */
    cancelOrder: builder.mutation({
      query: (orderId) => ({ url: `/orders/${orderId}/cancel`, method: "POST" }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "PENDING_LIST" },
      ],
    }),

    /** Hard delete — backend only allows this for Delivered/Canceled orders. */
    deleteOrder: builder.mutation({
      query: (orderId) => ({ url: `/orders/${orderId}`, method: "DELETE" }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "PENDING_LIST" },
        { type: "Order", id: "DELIVERED_LIST" },
      ],
    }),

    /**
     * Returns a PDF Blob. Usage in a component:
     *   const [downloadInvoice] = useDownloadInvoiceMutation();
     *   const blob = await downloadInvoice(orderId).unwrap();
     *   const url = URL.createObjectURL(blob);
     *   const a = document.createElement("a"); a.href = url; a.download = `invoice-${orderId}.pdf`; a.click();
     *   URL.revokeObjectURL(url);
     */
    downloadInvoice: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/invoice`,
        method: "GET",
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    getSellerContact: builder.query({
      query: (orderId) => `/orders/${orderId}/seller-contact`,
    }),

    /** Powers the Profile page's overview stats (pending / total spend / total orders). */
    getMyOrderStats: builder.query({
      query: () => "/orders/stats",
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetMyPendingOrdersQuery,
  useGetMyDeliveredOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useDeleteOrderMutation,
  useDownloadInvoiceMutation,
  useGetSellerContactQuery,
  useLazyGetSellerContactQuery,
  useGetMyOrderStatsQuery,
} = orderApi;
