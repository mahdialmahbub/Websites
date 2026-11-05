import { Router } from "express";
import { authLimiter, otpLimiter } from "../../middleware/rateLimiters.js";
import { validate } from "../../middleware/validate.js";
import * as controller from "./auth.controller.js";
import * as schemas from "./auth.schemas.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();

// e-mail + password
router.post(
  "/register",
  authLimiter,
  validate({ body: schemas.registerBody }),
  controller.register,
);
router.post(
  "/verify-email",
  otpLimiter,
  validate({ body: schemas.verifyEmailBody }),
  controller.verifyEmail,
);
router.post(
  "/resend-otp",
  otpLimiter,
  validate({ body: schemas.resendOtpBody }),
  controller.resendOtp,
);
router.post(
  "/login",
  authLimiter,
  validate({ body: schemas.loginBody }),
  controller.login,
);
router.post("/logout", controller.logout);

// delete account: send code (also "resend") -> confirm with code
router.post(
  "/delete-account/request",
  requireAuth,
  otpLimiter,
  controller.requestDeleteAccount,
);
router.post(
  "/delete-account",
  requireAuth,
  otpLimiter,
  validate({ body: schemas.deleteAccountBody }),
  controller.deleteAccount,
);

// password reset: forgot -> verify code -> choose new password
router.post(
  "/forgot-password",
  otpLimiter,
  validate({ body: schemas.forgotPasswordBody }),
  controller.forgotPassword,
);
router.post(
  "/verify-reset-otp",
  otpLimiter,
  validate({ body: schemas.verifyResetOtpBody }),
  controller.verifyResetOtp,
);
router.post(
  "/reset-password",
  authLimiter,
  validate({ body: schemas.resetPasswordBody }),
  controller.resetPassword,
);

// Google / LinkedIn (browser navigations, not fetch calls). Keep these AFTER the fixed paths above.
router.get("/providers", controller.providers);
router.get(
  "/:provider",
  validate({ params: schemas.oauthParams, query: schemas.oauthStartQuery }),
  controller.oauthStart,
);
router.get(
  "/:provider/callback",
  validate({ params: schemas.oauthParams }),
  controller.oauthCallback,
);

export default router;
