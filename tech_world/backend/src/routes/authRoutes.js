const express = require("express");
const router = express.Router();

const {
  register,
  verifyRegistrationOtp,
  resendOtp,
  login,
  verifyLoginOtp,
  logout,
  verifyForgotPasswordOtp,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
  otpValidator,
} = require("../validators/authValidators");
const validate = require("../middlewares/validate");
const { otpLimiter, loginLimiter } = require("../middlewares/rateLimiter");
const { createUploader } = require("../middlewares/upload");
const { protectCustomer } = require("../middlewares/auth");
const { forgotPasswordValidator, resetPasswordValidator } = require("../middlewares/forgotPasswordValidetor");

const uploadCustomerImage = createUploader("customers");

router.post(
  "/register",
  uploadCustomerImage.single("image"),
  registerValidator,
  validate,
  register,
);
router.post(
  "/verify-registration-otp",
  otpValidator,
  validate,
  verifyRegistrationOtp,
);
router.post("/resend-otp", otpLimiter, resendOtp);
router.post("/login", loginLimiter, loginValidator, validate, login);
router.post("/verify-login-otp", otpValidator, validate, verifyLoginOtp);
router.post("/logout", protectCustomer, logout);

// Forgot password (3-step: request OTP -> verify OTP -> set new password)
router.post(
  "/forgot-password",
  otpLimiter,
  forgotPasswordValidator,
  validate,
  forgotPassword,
);
router.post(
  "/verify-forgot-password-otp",
  otpValidator,
  validate,
  verifyForgotPasswordOtp,
);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

module.exports = router;
