const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    // References into product.variants[]._id — prices are always computed live
    // from the current product doc, so the cart never shows stale pricing.
    selectedVariantIds: [{ type: mongoose.Schema.Types.ObjectId }],
    selectedColor: { type: String },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
