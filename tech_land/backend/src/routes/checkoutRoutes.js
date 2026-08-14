const express = require("express");
const router = express.Router();

const { protectCustomer } = require("../middlewares/auth");
const { otpLimiter } = require("../middlewares/rateLimiter");
const { placeOrder, verifyPaymentOtp } = require("../controllers/checkoutController");
const { placeOrderValidator } = require("../validators/checkoutValidators");
const validate = require("../middlewares/validate");

router.use(protectCustomer);

router.post("/place-order", otpLimiter, placeOrderValidator, validate, placeOrder);
router.post("/verify-payment-otp", verifyPaymentOtp);

module.exports = router;
