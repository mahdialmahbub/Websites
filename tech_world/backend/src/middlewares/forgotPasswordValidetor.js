// Add these to your existing validators/authValidators.js
// (assumes the same `express-validator` `check(...)` pattern used by
// registerValidator / loginValidator / otpValidator — adjust field/rule
// names if your actual file uses a different validation library.)

const { check } = require("express-validator");

const forgotPasswordValidator = [
  check("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
];

const resetPasswordValidator = [
  check("resetToken").notEmpty().withMessage("Reset token is required."),
  check("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
];

module.exports = {
  // ...keep your existing exports (registerValidator, loginValidator, otpValidator, etc.)
  forgotPasswordValidator,
  resetPasswordValidator,
};