const mongoose = require("mongoose");

const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Recalculate product rating
 *
 * rating.average = average of all reviews
 * rating.count   = total number of reviews
 */
const refreshProductRating = async (productId) => {
  const objectProductId =
    typeof productId === "string"
      ? new mongoose.Types.ObjectId(productId)
      : productId;

  const stats = await Review.aggregate([
    {
      $match: {
        product: objectProductId,
      },
    },

    {
      $group: {
        _id: "$product",

        average: {
          $avg: "$rating",
        },

        count: {
          $sum: 1,
        },
      },
    },
  ]);

  let average = 0;
  let count = 0;

  if (stats.length > 0) {
    average = Math.round(stats[0].average * 10) / 10;
    count = stats[0].count;
  }

  await Product.findByIdAndUpdate(productId, {
    $set: {
      "rating.average": average,
      "rating.count": count,
    },
  });
};

/**
 * POST /api/products/:productId/reviews
 */
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const { orderId, rating, text } = req.body;

  // -----------------------------
  // Validate
  // -----------------------------

  if (!orderId) {
    throw new ApiError(400, "Order ID is required.");
  }

  if (!rating) {
    throw new ApiError(400, "Rating is required.");
  }

  const numericRating = Number(rating);

  if (
    !Number.isFinite(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    throw new ApiError(
      400,
      "Rating must be between 1 and 5."
    );
  }

  // -----------------------------
  // Check product
  // -----------------------------

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  // -----------------------------
  // Find customer's order
  // -----------------------------

  const order = await Order.findOne({
    _id: orderId,
    customer: req.customer._id,
    "items.product": productId,
  });

  if (!order) {
    throw new ApiError(
      403,
      "You can only review products you have purchased."
    );
  }

  // -----------------------------
  // Delivered order required
  // -----------------------------

  if (order.status !== "Delivered") {
    throw new ApiError(
      400,
      "You can only review products from delivered orders."
    );
  }

  // -----------------------------
  // Find exact order item
  // -----------------------------

  const orderItem = order.items.find(
    (item) =>
      item.product.toString() ===
      productId.toString()
  );

  if (!orderItem) {
    throw new ApiError(
      404,
      "Product not found in this order."
    );
  }

  // -----------------------------
  // Prevent duplicate review
  // -----------------------------

  if (orderItem.isReviewed) {
    throw new ApiError(
      400,
      "You have already reviewed this product for this order."
    );
  }

  // -----------------------------
  // Extra duplicate protection
  // -----------------------------

  const existingReview = await Review.findOne({
    product: productId,
    customer: req.customer._id,
    order: orderId,
  });

  if (existingReview) {
    orderItem.isReviewed = true;

    await order.save();

    throw new ApiError(
      400,
      "You have already reviewed this product for this order."
    );
  }

  // -----------------------------
  // Review images
  // -----------------------------

  const images = (req.files || []).map(
    (file) => ({
      url: `${process.env.UPLOAD_BASE_URL}/reviews/${file.filename}`,
      publicPath: file.path,
    })
  );

  // -----------------------------
  // Create review
  // -----------------------------

  const review = await Review.create({
    product: productId,
    customer: req.customer._id,
    order: orderId,
    rating: numericRating,
    text,
    images,
  });

  // -----------------------------
  // Mark order item reviewed
  // -----------------------------

  orderItem.isReviewed = true;

  await order.save();

  // -----------------------------
  // Recalculate product rating
  // -----------------------------

  await refreshProductRating(productId);

  // Populate customer if needed
  await review.populate(
    "customer",
    "name image address"
  );

  // -----------------------------
  // Response
  // -----------------------------

  res.status(201).json(
    new ApiResponse(
      201,
      review,
      "Review submitted. Thank you!"
    )
  );
});

/**
 * GET /api/products/:productId/reviews
 */
const getProductReviews = asyncHandler(
  async (req, res) => {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate(
        "customer",
        "name image address"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(
      new ApiResponse(
        200,
        reviews,
        "Reviews fetched successfully."
      )
    );
  }
);

/**
 * DELETE /api/admin/reviews/:reviewId
 */
const deleteReview = asyncHandler(
  async (req, res) => {
    const review = await Review.findByIdAndDelete(
      req.params.reviewId
    );

    if (!review) {
      throw new ApiError(
        404,
        "Review not found."
      );
    }

    // -----------------------------
    // Mark order item unreviewed
    // -----------------------------

    const order = await Order.findById(
      review.order
    );

    if (order) {
      const orderItem = order.items.find(
        (item) =>
          item.product.toString() ===
          review.product.toString()
      );

      if (orderItem) {
        orderItem.isReviewed = false;

        await order.save();
      }
    }

    // -----------------------------
    // Recalculate rating
    // -----------------------------

    await refreshProductRating(
      review.product
    );

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Review deleted."
      )
    );
  }
);

module.exports = {
  addReview,
  getProductReviews,
  deleteReview,
};