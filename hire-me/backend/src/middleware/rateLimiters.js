import { rateLimit } from 'express-rate-limit';

const make = ({ windowMs, limit, message, keyGenerator }) =>
  rateLimit({
    windowMs,
    limit,
    ...(keyGenerator && { keyGenerator }),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) =>
      res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message } }),
  });

const MINUTE = 60 * 1000;

/** Whole API, per IP */
export const apiLimiter = make({
  windowMs: 15 * MINUTE,
  limit: 600,
  message: 'Too many requests. Please slow down.',
});

/** register / login / reset-password */
export const authLimiter = make({
  windowMs: 15 * MINUTE,
  limit: 30,
  message: 'Too many attempts. Please try again in a few minutes.',
});

/** OTP verify / resend (per-email limits are enforced separately in the OTP service) */
export const otpLimiter = make({
  windowMs: 15 * MINUTE,
  limit: 20,
  message: 'Too many code requests. Please try again in a few minutes.',
});

export const uploadLimiter = make({
  windowMs: 60 * MINUTE,
  limit: 30,
  message: 'Too many uploads. Please try again later.',
});

/** Creating resumes (guests and users): generous for real people, a wall for scripts. */
export const resumeCreateLimiter = make({
  windowMs: 60 * MINUTE,
  limit: 60,
  message: 'You are creating resumes too quickly. Please try again later.',
});

/** Public review form (guests can use it) - per IP */
export const reviewLimiter = make({
  windowMs: 60 * MINUTE,
  limit: 10,
  message: 'Too many reviews from this connection. Please try again later.',
});

/** AI: one wall per IP address (stops many accounts / visitors behind one address) ... */
export const aiIpLimiter = make({
  windowMs: 60 * MINUTE,
  limit: 120,
  message: 'Too many AI requests from this connection. Please try again later.',
});

/** ... and one per person: the logged-in user, or the guest's IP. Guests get a smaller allowance. */
export const aiSubjectLimiter = rateLimit({
  windowMs: 60 * MINUTE,
  limit: (req) => (req.session?.userId ? 60 : 15),
  keyGenerator: (req) => (req.session?.userId ? `user:${req.session.userId}` : `ip:${req.ip}`),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: req.session?.userId
          ? 'You have used a lot of AI help this hour. Please try again later.'
          : 'You have used the free AI help for now. Log in for more, or try again later.',
      },
    }),
});
