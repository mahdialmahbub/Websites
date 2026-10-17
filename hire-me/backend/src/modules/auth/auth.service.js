import { ApiError } from '../../lib/ApiError.js';
import { sendOtpEmail } from '../../lib/emails.js';
import { logger } from '../../lib/logger.js';
import { burnPasswordCheck, hashPassword, needsRehash, verifyPassword } from '../../lib/password.js';
import { destroySession, regenerateSession, saveSession } from '../../lib/session.js';
import { User } from '../users/user.model.js';
import { Identity } from './identity.model.js';
import { OTP_PURPOSES, issueOtp, verifyOtp } from './otp.service.js';

const RESET_GRANT_TTL_MS = 10 * 60 * 1000;

/** Logs the user in: brand-new session id, then remember who they are. */
export async function establishSession(req, user) {
  await regenerateSession(req);
  req.session.userId = String(user._id);
  req.session.authVersion = user.authVersion;
  await saveSession(req);
  await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
}

export async function logout(req) {
  await destroySession(req);
}

async function sendVerificationOtp({ email, name }) {
  const otp = await issueOtp({ email, purpose: OTP_PURPOSES.VERIFY_EMAIL });
  await sendOtpEmail({
    to: email,
    name,
    purpose: OTP_PURPOSES.VERIFY_EMAIL,
    code: otp.code,
    expiresInMinutes: otp.expiresInMinutes,
  });
  return { email, expiresInMinutes: otp.expiresInMinutes, resendAfterSeconds: otp.resendAfterSeconds };
}

export async function register({ name, email, password }) {
  const existing = await User.findOne({ email }).select('+passwordHash');
  if (existing?.emailVerified) {
    throw new ApiError(409, 'EMAIL_TAKEN', 'An account with this email already exists. Try logging in instead.');
  }

  // An unverified account can safely be overwritten: only the owner of the mailbox can verify it.
  const passwordHash = await hashPassword(password);
  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    await existing.save();
  } else {
    await User.create({ name, email, passwordHash });
  }

  return sendVerificationOtp({ email, name });
}

export async function verifyEmail({ email, otp }, req) {
  await verifyOtp({ email, purpose: OTP_PURPOSES.VERIFY_EMAIL, code: otp });

  const user = await User.findOneAndUpdate(
    { email },
    { $set: { emailVerified: true, emailVerifiedAt: new Date() } },
    { new: true },
  );
  if (!user) throw new ApiError(400, 'INVALID_OTP', 'The code is incorrect or has expired');

  await establishSession(req, user);
  return user;
}

export async function login({ email, password }, req) {
  const user = await User.findOne({ email }).select('+passwordHash');

  const valid = user?.passwordHash
    ? await verifyPassword(user.passwordHash, password)
    : (await burnPasswordCheck(password), false);
  if (!valid) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

  if (!user.emailVerified) {
    // Correct password but the mailbox was never confirmed: send a fresh code and tell the client.
    await sendVerificationOtp(user).catch((err) =>
      logger.warn('[auth] could not auto-send a verification code:', err.message),
    );
    throw new ApiError(403, 'EMAIL_NOT_VERIFIED', 'Please verify your email address to continue', {
      email: user.email,
    });
  }

  if (needsRehash(user.passwordHash)) {
    user.passwordHash = await hashPassword(password);
    await user.save();
  }

  await establishSession(req, user);
  return user;
}

/**
 * Sends a verification / reset code. The answer is identical whether or not the account exists,
 * and the e-mail is sent in the background, so neither the response nor its timing reveals which
 * addresses are registered.
 */
export async function requestOtp({ email, purpose }) {
  const user = await User.findOne({ email });
  const eligible =
    purpose === OTP_PURPOSES.VERIFY_EMAIL ? Boolean(user && !user.emailVerified) : Boolean(user?.emailVerified);

  const otp = await issueOtp({ email, purpose }); // always counts towards the resend limits

  if (eligible) {
    sendOtpEmail({
      to: email,
      name: user.name,
      purpose,
      code: otp.code,
      expiresInMinutes: otp.expiresInMinutes,
    }).catch(() => {}); // the mailer already logged the failure
  }

  return { expiresInMinutes: otp.expiresInMinutes, resendAfterSeconds: otp.resendAfterSeconds };
}

/** Password reset, step 2: the code is correct -> open a short "reset window" inside this browser's session. */
export async function verifyResetOtp({ email, otp }, req) {
  await verifyOtp({ email, purpose: OTP_PURPOSES.RESET_PASSWORD, code: otp });

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, 'INVALID_OTP', 'The code is incorrect or has expired');

  req.session.passwordReset = { userId: String(user._id), expiresAt: Date.now() + RESET_GRANT_TTL_MS };
  await saveSession(req);
}

/** Password reset, step 3: choose the new password. */
export async function resetPassword({ password }, req) {
  const grant = req.session?.passwordReset;
  if (!grant || grant.expiresAt < Date.now()) {
    throw new ApiError(400, 'RESET_EXPIRED', 'Your reset session has expired. Please start again.');
  }

  const user = await User.findById(grant.userId).select('+passwordHash');
  if (!user) throw new ApiError(400, 'RESET_EXPIRED', 'Your reset session has expired. Please start again.');

  user.passwordHash = await hashPassword(password);
  user.authVersion += 1; // every existing session of this user stops working
  await user.save();

  await destroySession(req);
}

/** Google / LinkedIn: find the matching account or create one. */
export async function loginWithOAuthProfile(profile) {
  const { provider, providerId, email, emailVerified, name, picture } = profile;
  if (!providerId) throw new ApiError(400, 'OAUTH_PROFILE_INVALID', 'The provider did not return a valid account');

  // 1) Returning user: this provider account is already linked.
  const identity = await Identity.findOne({ provider, providerId });
  if (identity) {
    const linked = await User.findById(identity.user);
    if (linked) return linked;
    await Identity.deleteOne({ _id: identity._id }); // orphaned link
  }

  // 2) First time: we only trust an e-mail address the provider has verified.
  if (!email || !emailVerified) {
    throw new ApiError(
      403,
      'OAUTH_EMAIL_UNVERIFIED',
      'Your account has no verified email address, so we cannot sign you in with it.',
    );
  }

  let user = await User.findOne({ email }).select('+passwordHash');
  if (user) {
    if (!user.emailVerified) {
      // Someone may have pre-registered this address with a password they chose.
      // The provider just proved the real owner's identity, so that password is discarded.
      user.passwordHash = undefined;
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      user.authVersion += 1;
    }
    if (!user.avatarUrl && picture) user.avatarUrl = picture;
    await user.save();
  } else {
    user = await User.create({
      name: (name || email.split('@')[0]).slice(0, 80),
      email,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      avatarUrl: picture,
    });
  }

  await Identity.create({ user: user._id, provider, providerId });
  return user;
}
