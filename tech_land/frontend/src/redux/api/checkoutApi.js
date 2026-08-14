import { baseApi } from "./baseApi";

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * fields: {
     *   paymentMethod: "Cash on Delivery" | "Credit Card",
     *   addressId?, newAddress?,                          // pick one
     *   savedCardId?, card?: { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv }  // pick one, Credit Card only
     * }
     *
     * Response for Cash on Delivery: { order, paymentVerificationRequired: false } — order is placed immediately.
     * Response for Credit Card: { paymentVerificationRequired: true } — call verifyPaymentOtp next.
     */
    placeOrder: builder.mutation({
      query: (fields) => ({ url: "/checkout/place-order", method: "POST", body: fields }),
      // Only COD actually creates the order (and clears the cart) at this step
      invalidatesTags: (result) => (result?.data?.paymentVerificationRequired === false ? ["Cart", "Order"] : []),
    }),

    /** Completes a Credit Card order after the phone OTP is entered. */
    verifyPaymentOtp: builder.mutation({
      query: (otp) => ({ url: "/checkout/verify-payment-otp", method: "POST", body: { otp } }),
      invalidatesTags: ["Cart", "Order"],
    }),
  }),
});

export const { usePlaceOrderMutation, useVerifyPaymentOtpMutation } = checkoutApi;
