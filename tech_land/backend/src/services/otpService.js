const Otp = require("../models/Otp");
const { generateNumericOtp, hashOtp } = require("../utils/otp");
const ApiError = require("../utils/ApiError");

const EXPIRES_MINUTES = () => Number(process.env.OTP_EXPIRES_MINUTES) || 5;

/**
 * Creates (or replaces) an OTP for the given identifier + purpose, and returns the raw code
 * so the caller can send it via email/SMS. Only the hash is persisted.
 */
const createOtp = async ({ identifier, purpose, meta = {} }) => {
  // Invalidate any previous unused OTPs for the same identifier+purpose
  await Otp.deleteMany({ identifier, purpose, isUsed: false });

  const rawOtp = generateNumericOtp();
  const expiresAt = new Date(Date.now() + EXPIRES_MINUTES() * 60 * 1000);

  await Otp.create({
    identifier,
    purpose,
    codeHash: hashOtp(rawOtp),
    meta,
    expiresAt,
  });

  return rawOtp;
};

/**
 * Verifies a submitted OTP. Throws ApiError on mismatch/expiry/overuse.
 * Marks the OTP as used on success and returns its stored `meta`.
 */
const verifyOtp = async ({ identifier, purpose, code }) => {
  const otpDoc = await Otp.findOne({ identifier, purpose, isUsed: false }).sort({ createdAt: -1 });

  if (!otpDoc) throw new ApiError(400, "No active OTP found. Please request a new one.");
  if (otpDoc.expiresAt < new Date()) throw new ApiError(400, "OTP has expired. Please request a new one.");
  if (otpDoc.attempts >= 5) throw new ApiError(429, "Too many incorrect attempts. Please request a new OTP.");

  if (otpDoc.codeHash !== hashOtp(code)) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    throw new ApiError(400, "Invalid OTP.");
  }

  otpDoc.isUsed = true;
  await otpDoc.save();

  return otpDoc.meta;
};

module.exports = { createOtp, verifyOtp };
