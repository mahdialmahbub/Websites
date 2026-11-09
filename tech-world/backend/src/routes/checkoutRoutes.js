const express = require("express");
const router = express.Router();

const { protectCustomer } = require("../middlewares/auth");
const { otpLimiter } = require("../middlewares/rateLimiter");
const { placeOrder, verifyPaymentOtp, getCheckoutPreview } = require("../controllers/checkoutController");
const { placeOrderValidator } = require("../validators/checkoutValidators");
const validate = require("../middlewares/validate");

router.use(protectCustomer);

router.get("/preview", getCheckoutPreview);
router.post("/place-order", otpLimiter, placeOrderValidator, validate, placeOrder);
router.post("/verify-payment-otp", verifyPaymentOtp);

module.exports = router;
