const { body } = require("express-validator");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  // Phone is collected in a later onboarding step (not at registration), so it's optional here.
  body("phone").optional({ checkFalsy: true }).trim(),
  // checkFalsy: true -> also skips validation when the value is "" (not just when it's missing/undefined)
  body("gender").optional({ checkFalsy: true }).isIn(["Male", "Female", "Other"]),
];

const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

const otpValidator = [
  body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("otp").isLength({ min: 4, max: 8 }).withMessage("Invalid OTP."),
];

module.exports = { registerValidator, loginValidator, otpValidator };
