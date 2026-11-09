const express = require("express");
const router = express.Router();

const { getProducts, getProductById } = require("../controllers/productController");
const { addReview, getProductReviews } = require("../controllers/reviewController");
const { protectCustomer } = require("../middlewares/auth");
const { createUploader } = require("../middlewares/upload");
const uploadReviewImages = createUploader("reviews");

// Public storefront
router.get("/", getProducts);
router.get("/:id", getProductById);

// Reviews
router.get("/:productId/reviews", getProductReviews);
router.post("/:productId/reviews", protectCustomer, uploadReviewImages.array("images", 5), addReview);

module.exports = router;
