const { body } = require("express-validator");

const productValidator = [
  body("title").trim().notEmpty().withMessage("Product title is required."),
  body("description").trim().notEmpty().withMessage("Product description is required."),
  body("brand").notEmpty().withMessage("Brand is required."),
  body("category").notEmpty().withMessage("Category is required."),
  body("startingPrice").isFloat({ min: 0 }).withMessage("Starting price must be a positive number."),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer."),
  body("discountPercentage").optional().isFloat({ min: 0, max: 100 }),
];

module.exports = { productValidator };
