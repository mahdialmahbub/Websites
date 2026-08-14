const mongoose = require("mongoose");

/**
 * SECURITY NOTE (PCI-DSS): We deliberately never persist the full card
 * number or CVV/CVC — storing those yourself is a serious compliance and
 * security liability. Only a masked number + network are kept for display,
 * exactly like real e-commerce sites do. In production, swap this for a
 * tokenized reference from a real payment gateway (Stripe/SSLCommerz/etc.)
 * instead of handling raw PANs at all.
 */
const cardSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    maskedNumber: { type: String, required: true }, // "**** **** **** 1234"
    last4: { type: String, required: true },
    network: { type: String, required: true }, // Visa / Mastercard / etc.
    cardHolderName: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    billingAddress: {
      apartmentNumber: String,
      buildingNumber: String,
      roadNumber: String,
      locality: String,
      area: String,
      city: String,
      postCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
