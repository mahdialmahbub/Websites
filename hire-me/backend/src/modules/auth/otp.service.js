import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import { ApiError } from '../../lib/ApiError.js';
import { Otp } from './otp.model.js';

export const OTP_PURPOSES = Object.freeze({ VERIFY_EMAIL: 'verify_email', RESET_PASSWORD: 'reset_password' });

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000; //        a code is valid for 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; //     at least 60 s between two codes
const MAX_SENDS_PER_WINDOW = 5; //           at most 5 codes ...
const WINDOW_MS = 60 * 60 * 1000; //         ... per hour, per email + purpose
const MAX_ATTEMPTS = 5; //                   5 wrong guesses and the code is dead

const hashCode = (email, purpose, code) =>
  crypto.createHmac('sha256', env.OTP_SECRET).update(`${purpose}:${email}:${code}`).digest('hex');

const generateCode = () => String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');

const safeEqual = (a, b) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

const tooMany = (seconds) =>
  new ApiError(429, 'OTP_RATE_LIMITED', `Please wait ${seconds} seconds before requesting another code`, {
    retryAfterSeconds: seconds,
  });

const invalidCode = () => new ApiError(400, 'INVALID_OTP', 'The code is incorrect or has expired');

/**
 * Creates a fresh code (replacing the previous one) and applies the resend limits.
 * It is called even for unknown e-mail addresses (the caller just doesn't send the e-mail),
 * so the limits - and therefore the responses - look identical for existing and unknown accounts.
 *
 * @returns {{ code: string, expiresInMinutes: number, resendAfterSeconds: number }}
 */
export async function issueOtp({ email, purpose }) {
  const now = new Date();
  let doc = await Otp.findOne({ email, purpose });

  if (doc) {
    const sinceLast = now - doc.lastSentAt;
    if (sinceLast < RESEND_COOLDOWN_MS) throw tooMany(Math.ceil((RESEND_COOLDOWN_MS - sinceLast) / 1000));

    if (now - doc.windowStart >= WINDOW_MS) {
      doc.windowStart = now;
      doc.sendCount = 0;
    }
    if (doc.sendCount >= MAX_SENDS_PER_WINDOW) {
      throw tooMany(Math.ceil((doc.windowStart.getTime() + WINDOW_MS - now.getTime()) / 1000));
    }
  } else {
    doc = new Otp({ email, purpose, windowStart: now, sendCount: 0 });
  }

  const code = generateCode();
  doc.codeHash = hashCode(email, purpose, code);
  doc.expiresAt = new Date(now.getTime() + OTP_TTL_MS);
  doc.attempts = 0;
  doc.lastSentAt = now;
  doc.sendCount += 1;
  doc.purgeAt = new Date(Math.max(doc.windowStart.getTime() + WINDOW_MS, doc.expiresAt.getTime()));
  await doc.save();

  return { code, expiresInMinutes: OTP_TTL_MS / 60_000, resendAfterSeconds: RESEND_COOLDOWN_MS / 1000 };
}

/** Checks a code and consumes it (a code works exactly once). Throws ApiError on any failure. */
export async function verifyOtp({ email, purpose, code }) {
  const doc = await Otp.findOne({ email, purpose });
  if (!doc || !doc.codeHash || doc.expiresAt <= new Date()) throw invalidCode();
  if (doc.attempts >= MAX_ATTEMPTS) {
    throw new ApiError(429, 'OTP_ATTEMPTS_EXCEEDED', 'Too many incorrect attempts. Please request a new code.');
  }

  if (!safeEqual(doc.codeHash, hashCode(email, purpose, code))) {
    const updated = await Otp.findOneAndUpdate(
      { _id: doc._id, codeHash: doc.codeHash },
      { $inc: { attempts: 1 } },
      { new: true },
    );
    if (updated && updated.attempts >= MAX_ATTEMPTS) {
      await Otp.updateOne({ _id: doc._id }, { $set: { codeHash: null } });
    }
    throw invalidCode();
  }

  // Atomic "consume": if two requests race with the same correct code, only one wins.
  const consumed = await Otp.findOneAndUpdate({ _id: doc._id, codeHash: doc.codeHash }, { $set: { codeHash: null } });
  if (!consumed) throw invalidCode();
}
