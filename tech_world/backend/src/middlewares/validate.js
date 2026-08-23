const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Runs after express-validator check() chains; converts failures into a single ApiError
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation failed", errors.array().map((e) => e.msg)));
  }
  next();
};

module.exports = validate;
