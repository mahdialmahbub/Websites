const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    apartmentNumber: String,
    buildingNumber: String,
    roadNumber: String,
    locality: String,
    area: String,
    city: String,
    postCode: String,
    country: String,
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
