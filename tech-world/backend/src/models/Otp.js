const mongoose = require("mongoose");
const { OTP_PURPOSE } = require("../config/constants");

const otpSchema = new mongoose.Schema(
  {
    // identifier is an email or a phone number depending on the purpose
    identifier: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    purpose: { type: String, enum: OTP_PURPOSE, required: true },
    // Any extra context needed to complete the action once OTP is verified
    // e.g. pending new password, pending card details, related order ID
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    attempts: { type: Number, default: 0 },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// MongoDB TTL index — the document is automatically deleted once expiresAt passes.
// This satisfies "OTP will be temporarily stored and automatically deleted after a certain period".
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);
