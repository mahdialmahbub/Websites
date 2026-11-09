// redux/api/adminDashboardApi.js

import { baseApi } from "./baseApi";

const toQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== "",
    )
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
    )
    .join("&");

  return query ? `?${query}` : "";
};

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // 1. DASHBOARD OVERVIEW
    // ==========================================
    getOverviewStats: builder.query({
      query: () => "/admin/dashboard/overview",

      providesTags: ["Overview"],
    }),

    // ==========================================
    // 2. ADMIN ORDERS LIST
    // ==========================================
    /**
     * params:
     * {
     *   status,
     *   paymentMethod,
     *   sortByPrice,
     *   search,
     *   page,
     *   limit
     * }
     */
    getOrdersAdmin: builder.query({
      query: (params) =>
        `/admin/orders${toQueryString(params)}`,

      providesTags: (result) => {
        const orders = result?.data?.orders;

        if (!orders) {
          return [
            {
              type: "AdminOrder",
              id: "LIST",
            },
          ];
        }

        const orderTags = orders.map((order) => ({
          type: "AdminOrder",
          id: order._id,
        }));

        // Delivery Man tags
        const deliveryManTags = orders
          .filter((order) => order.deliveryMan?._id)
          .map((order) => ({
            type: "DeliveryMan",
            id: order.deliveryMan._id,
          }));

        return [
          ...orderTags,

          ...deliveryManTags,

          {
            type: "AdminOrder",
            id: "LIST",
          },

          {
            type: "DeliveryMan",
            id: "LIST",
          },
        ];
      },
    }),

    // ==========================================
    // 3. ADMIN ORDER DETAILS
    // ==========================================
    getOrderDetailsAdmin: builder.query({
      query: ({ orderId }) =>
        `/admin/orders/${orderId}`,

      /**
       * IMPORTANT:
       *
       * query argument is { orderId }
       * তাই 3rd argument-এ পুরো object পাওয়া যাবে।
       */
      providesTags: (result, error, { orderId }) => [
        {
          type: "AdminOrder",
          id: orderId,
        },

        ...(result?.data?.deliveryMan?._id
          ? [
              {
                type: "DeliveryMan",
                id: result.data.deliveryMan._id,
              },
            ]
          : []),
      ],
    }),

    // ==========================================
    // 4. UPDATE ORDER STATUS / DELIVERY INFO
    // ==========================================
    /**
     * fields:
     * {
     *   status?,
     *   trackingId?,
     *   estimatedDeliveryDate?,
     *   deliveryManId?
     * }
     *
     * previousDeliveryManId:
     * - এটা backend-এ পাঠানো হবে না
     * - শুধু RTK Query cache invalidation-এর জন্য
     */
    updateOrderStatusAdmin: builder.mutation({
      query: ({
        orderId,
        previousDeliveryManId,
        ...fields
      }) => ({
        url: `/admin/orders/${orderId}`,
        method: "PATCH",

        // previousDeliveryManId বাদ দিয়ে
        // শুধু backend প্রয়োজনীয় fields পাঠাচ্ছি
        body: fields,
      }),

      invalidatesTags: (
        result,
        error,
        {
          orderId,
          deliveryManId,
          previousDeliveryManId,
        },
      ) => {
        const tags = [
          // Updated order details
          {
            type: "AdminOrder",
            id: orderId,
          },

          // Order list
          {
            type: "AdminOrder",
            id: "LIST",
          },

          // Dashboard overview
          "Overview",

          // Delivery man list
          {
            type: "DeliveryMan",
            id: "LIST",
          },
        ];

        // ======================================
        // NEW DELIVERY MAN
        // ======================================
        if (deliveryManId) {
          tags.push({
            type: "DeliveryMan",
            id: deliveryManId,
          });
        }

        // ======================================
        // PREVIOUS DELIVERY MAN
        // ======================================
        if (previousDeliveryManId) {
          tags.push({
            type: "DeliveryMan",
            id: previousDeliveryManId,
          });
        }

        // ======================================
        // CURRENT DELIVERY MAN FROM RESPONSE
        // ======================================
        const currentDeliveryManId =
          result?.data?.deliveryMan?._id;

        if (
          currentDeliveryManId &&
          currentDeliveryManId !== deliveryManId &&
          currentDeliveryManId !==
            previousDeliveryManId
        ) {
          tags.push({
            type: "DeliveryMan",
            id: currentDeliveryManId,
          });
        }

        return tags;
      },
    }),

    // ==========================================
    // 5. DELETE ORDER
    // ==========================================
    deleteOrderAdmin: builder.mutation({
      query: (orderId) => ({
        url: `/admin/orders/${orderId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, orderId) => [
        {
          type: "AdminOrder",
          id: orderId,
        },

        {
          type: "AdminOrder",
          id: "LIST",
        },

        "Overview",
      ],
    }),

    // ==========================================
    // 6. DOWNLOAD INVOICE
    // ==========================================
    downloadInvoiceAdmin: builder.mutation({
      query: (orderId) => ({
        url: `/admin/orders/${orderId}/invoice`,
        method: "GET",

        responseHandler: (response) =>
          response.blob(),

        cache: "no-cache",
      }),
    }),

    // ==========================================
    // 7. ADMIN CUSTOMERS
    // ==========================================
    /**
     * params:
     * {
     *   sortBy,
     *   paymentMethod,
     *   search,
     *   page,
     *   limit
     * }
     */
    getCustomersAdmin: builder.query({
      query: (params) =>
        `/admin/customers${toQueryString(params)}`,

      providesTags: (result) => {
        const customers = result?.data?.customers;

        if (!customers) {
          return [
            {
              type: "AdminCustomer",
              id: "LIST",
            },
          ];
        }

        return [
          ...customers.map((customer) => ({
            type: "AdminCustomer",
            id: customer._id,
          })),

          {
            type: "AdminCustomer",
            id: "LIST",
          },
        ];
      },
    }),

    // ==========================================
    // 8. CUSTOMER DETAILS
    // ==========================================
    getCustomerDetailsAdmin: builder.query({
      query: (customerId) =>
        `/admin/customers/${customerId}`,

      providesTags: (
        result,
        error,
        customerId,
      ) => [
        {
          type: "AdminCustomer",
          id: customerId,
        },
      ],
    }),

    // ==========================================
    // 9. DELETE CUSTOMER
    // ==========================================
    deleteCustomerAdmin: builder.mutation({
      query: (customerId) => ({
        url: `/admin/customers/${customerId}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "AdminCustomer",
          id: "LIST",
        },

        "Overview",
      ],
    }),

    // ==========================================
    // 10. ADMIN MESSAGES
    // ==========================================
    /**
     * params:
     * {
     *   search,
     *   page,
     *   limit
     * }
     */
    getMessagesAdmin: builder.query({
      query: (params) =>
        `/admin/messages${toQueryString(params)}`,

      providesTags: (result) => {
        const messages = result?.data?.messages;

        if (!messages) {
          return [
            {
              type: "Message",
              id: "LIST",
            },
          ];
        }

        return [
          ...messages.map((message) => ({
            type: "Message",
            id: message._id,
          })),

          {
            type: "Message",
            id: "LIST",
          },
        ];
      },
    }),

    // ==========================================
    // 11. MESSAGE DETAILS
    // ==========================================
    getMessageDetailsAdmin: builder.query({
      query: (messageId) =>
        `/admin/messages/${messageId}`,

      providesTags: (
        result,
        error,
        messageId,
      ) => [
        {
          type: "Message",
          id: messageId,
        },
      ],
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