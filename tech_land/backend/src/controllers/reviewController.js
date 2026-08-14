const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Recomputes and stores the product's average rating + review count
const refreshProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const { average = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, {
    "rating.average": Math.round(average * 10) / 10,
    "rating.count": count,
  });
};

/**
 * POST /api/products/:productId/reviews
 * Only customers who purchased the product (order exists & contains it) may review.
 */
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { orderId, rating, text } = req.body;

  const order = await Order.findOne({ _id: orderId, customer: req.customer._id, "items.product": productId });
  if (!order) {
    throw new ApiError(403, "You can only review products you have purchased.");
  }

  const images = (req.files || []).map((file) => ({
    url: `${process.env.UPLOAD_BASE_URL}/reviews/${file.filename}`,
    publicPath: file.path,
  }));

  const review = await Review.create({
    product: productId,
    customer: req.customer._id,
    order: orderId,
    rating,
    text,
    images,
  });

  await refreshProductRating(productId);

  res.status(201).json(new ApiResponse(201, review, "Review submitted. Thank you!"));
});

/**
 * GET /api/products/:productId/reviews — public, used by Product Details page
 */
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("customer", "name image address")
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, reviews));
});

/**
 * DELETE /api/admin/reviews/:reviewId — reviews can only be deleted from the Edit Product page
 */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.reviewId);
  if (!review) throw new ApiError(404, "Review not found.");
  await refreshProductRating(review.product);
  res.status(200).json(new ApiResponse(200, null, "Review deleted."));
});

module.exports = { addReview, getProductReviews, deleteReview };
