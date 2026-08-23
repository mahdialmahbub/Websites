const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // proves verified purchase
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    images: [{ url: String, publicPath: String }],
  },
  { timestamps: true }
);

// A customer can only review a product once per order (prevents duplicate/fake reviews)
reviewSchema.index({ product: 1, customer: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
