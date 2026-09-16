const mongoose = require("mongoose");
const { PRODUCT_STATUS } = require("../config/constants");

// Each variant has a price ADJUSTMENT (+ or -) applied on top of startingPrice.
// e.g. startingPrice=1000, variant "16GB RAM" priceAdjustment=+200 -> 1200
const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "16GB"
    group: { type: String, trim: true }, // optional grouping label, e.g. "RAM"
    priceAdjustment: { type: Number, required: true, default: 0 }, // positive = increase, negative = decrease
    isDefault: { type: Boolean, default: false }, // pre-selected on Product Details page
  },
  { _id: true },
);

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hexCode: { type: String, trim: true },
  },
  { _id: true },
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicPath: { type: String, required: true },
  },
  { _id: true },
);

// Guarantee / Replacement / Tested info blocks, each with icon + title + subtitle
const supportBlockSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "shield-check" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: { type: [imageSchema], validate: (v) => v.length > 0 },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],

    // productSchema.js — replace the existing variants validator
    variants: {
      type: [variantSchema],
      validate: {
        validator(variants) {
          if (!variants?.length) return true;
          const defaultsPerGroup = {};
          for (const v of variants) {
            const key = v.group || "ungrouped";
            if (v.isDefault) {
              if (defaultsPerGroup[key]) return false;
              defaultsPerGroup[key] = true;
            }
          }
          return true;
        },
        message: "Only one variant per group can be set as default.",
      },
    },
    colors: [colorSchema],

    // Single combined tag list, matching the "Specifications & Features" add/remove tag UI
    specifications: [{ type: String, trim: true }],

    startingPrice: { type: Number, required: true, min: 0 },

    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },

    stock: { type: Number, required: true, min: 0, default: 0 },

    guaranteeMonths: { type: Number, default: 0 },
    warrantyMonths: { type: Number, default: 0 },

    supportInfo: {
      guarantee: { type: supportBlockSchema, default: () => ({}) },
      replacement: { type: supportBlockSchema, default: () => ({}) },
      tested: { type: supportBlockSchema, default: () => ({}) },
    },

    sellerPhone: { type: String },

    status: { type: String, enum: PRODUCT_STATUS, default: "Active" },

    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    soldCount: { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

productSchema.index({ title: "text", description: "text" });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ badges: 1 });

module.exports = mongoose.model("Product", productSchema);
