import mongoose from 'mongoose';

/**
 * One document per (email, purpose). It stores the HASH of the current code plus the counters
 * used for resend limits. The document outlives the code (purgeAt) so limits can't be reset
 * by simply waiting for the code to expire.
 */
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  purpose: { type: String, enum: ['verify_email', 'reset_password'], required: true },
  codeHash: { type: String, default: null }, // null = no valid code (consumed or too many attempts)
  expiresAt: { type: Date, required: true }, // when the code stops being valid
  attempts: { type: Number, default: 0 }, // wrong guesses for the current code
  lastSentAt: { type: Date, required: true },
  windowStart: { type: Date, required: true }, // start of the hourly "max sends" window
  sendCount: { type: Number, default: 0 }, // sends inside the current window
  purgeAt: { type: Date, required: true }, // MongoDB deletes the document after this moment
});

otpSchema.index({ email: 1, purpose: 1 }, { unique: true });
otpSchema.index({ purgeAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model('Otp', otpSchema);
