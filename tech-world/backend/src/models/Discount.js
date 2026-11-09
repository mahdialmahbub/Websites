const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    percentage: { type: Number, required: true, min: 1, max: 100, unique: true },
    isDefault: { type: Boolean, default: false }, // true for the seeded 15% / 30% tags
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
