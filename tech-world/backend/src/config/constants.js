// Centralized enums/constants so every model & controller stays consistent.

module.exports = {
  ORDER_STATUS: [
    "Pending",
    "Placed",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Canceled",
  ],

  // Order can only be cancelled while status is before "Shipped" in this list
  CANCELABLE_BEFORE_STATUS: "Shipped",

  PAYMENT_METHOD: ["Cash on Delivery", "Credit Card"],
  PAYMENT_STATUS: ["Pending", "Paid", "Failed", "Refunded"],

  OTP_PURPOSE: [
    "EMAIL_VERIFICATION",
    "LOGIN_2FA",
    "DELETE_ACCOUNT",
    "CHANGE_PASSWORD",
    "ADD_CARD",
    "PAYMENT_VERIFICATION",
    "FORGOT_PASSWORD",
  ],

  GENDER: ["Male", "Female", "Other"],

  PRODUCT_STATUS: ["Active", "Paused"],

  IMAGE_MIME_TYPES: ["image/png", "image/jpeg", "image/jpg"],
};
