const express = require("express");
const router = express.Router();

const {
  register,
  verifyRegistrationOtp,
  resendOtp,
  login,
  verifyLoginOtp,
  logout,
} = require("../controllers/authController");
const { registerValidator, loginValidator, otpValidator } = require("../validators/authValidators");
const validate = require("../middlewares/validate");
const { otpLimiter, loginLimiter } = require("../middlewares/rateLimiter");
const { createUploader } = require("../middlewares/upload");
const { protectCustomer } = require("../middlewares/auth");

const uploadCustomerImage = createUploader("customers");

router.post("/register", uploadCustomerImage.single("image"), registerValidator, validate, register);
router.post("/verify-registration-otp", otpValidator, validate, verifyRegistrationOtp);
router.post("/resend-otp", otpLimiter, resendOtp);
router.post("/login", loginLimiter, loginValidator, validate, login);
router.post("/verify-login-otp", otpValidator, validate, verifyLoginOtp);
router.post("/logout", protectCustomer, logout);

module.exports = router;
