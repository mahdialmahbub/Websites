const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    // Optional hint for the admin UI — e.g. Laptop -> ["RAM", "Storage", "Processor"]
    // so the "Add Variant" modal can group variants under these labels.
    variantGroups: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
