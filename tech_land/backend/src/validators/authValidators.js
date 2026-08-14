const { body } = require("express-validator");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  body("phone").trim().notEmpty().withMessage("Phone number is required."),
  body("gender").optional().isIn(["Male", "Female", "Other"]),
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
