import { z } from 'zod';

// Empty values (KEY=) are treated as "not set" so defaults and optional fields behave as expected.
const raw = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => typeof value === 'string' && value.trim() !== ''),
);

const list = z
  .string()
  .default('')
  .transform((value) => value.split(',').map((item) => item.trim()).filter(Boolean));

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  APP_NAME: z.string().default('Resume Builder'),

  CLIENT_URL: z.string().url('must be a full URL, e.g. http://localhost:3000'),
  EXTRA_ALLOWED_ORIGINS: list,
  API_PUBLIC_URL: z.string().url().default('http://localhost:5000'),
  POST_LOGIN_PATH: z.string().startsWith('/').default('/'),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  MONGODB_URI: z.string().min(1, 'is required'),

  SESSION_SECRET: z.string().min(32, 'must be at least 32 characters'),
  OTP_SECRET: z.string().min(32, 'must be at least 32 characters'),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_SECURE: z.enum(['true', 'false']).optional(),
  COOKIE_DOMAIN: z.string().optional(),

  MAIL_PROVIDER: z.enum(['console', 'smtp', 'resend', 'sendgrid']).default('console'),
  MAIL_FROM: z.string().default('Resume Builder <no-reply@example.com>'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),

  // AI description enhancer. Without a key the "Improve with AI" buttons answer 503 AI_UNAVAILABLE.
  AI_PROVIDER: z.enum(['gemini']).default('gemini'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  AI_TIMEOUT_MS: z.coerce.number().int().min(3000).max(60000).default(20000),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default('resume-builder'),

  // Who may use /api/admin/*. Comma separated e-mail addresses (the account must have a verified e-mail).
  // There is no admin dashboard in the website, so admin work is done with these API routes.
  ADMIN_EMAILS: list,

  // How long a guest's anonymous cookie (and so their saved resumes) lives.
  GUEST_COOKIE_DAYS: z.coerce.number().int().positive().default(365),
});

const parsed = schema.safeParse(raw);

function fail(lines) {
  console.error('\n❌ Invalid environment configuration:\n');
  for (const line of lines) console.error(`  • ${line}`);
  console.error('\nCopy .env.example to .env and fill in the missing values.\n');
  process.exit(1);
}

if (!parsed.success) {
  fail(parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`));
}

const config = parsed.data;
const isProd = config.NODE_ENV === 'production';

const problems = [];
if (config.MAIL_PROVIDER === 'smtp' && !(config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS)) {
  problems.push('MAIL_PROVIDER=smtp needs SMTP_HOST, SMTP_USER and SMTP_PASS');
}
if (config.MAIL_PROVIDER === 'resend' && !config.RESEND_API_KEY) {
  problems.push('MAIL_PROVIDER=resend needs RESEND_API_KEY');
}
if (config.MAIL_PROVIDER === 'sendgrid' && !config.SENDGRID_API_KEY) {
  problems.push('MAIL_PROVIDER=sendgrid needs SENDGRID_API_KEY');
}
if (isProd && config.MAIL_PROVIDER === 'console') {
  problems.push('MAIL_PROVIDER=console is not allowed in production');
}
if (config.COOKIE_SAMESITE === 'none' && config.COOKIE_SECURE === 'false') {
  problems.push('COOKIE_SAMESITE=none requires secure cookies (HTTPS)');
}
if (problems.length) fail(problems);

const toOrigin = (url) => new URL(url).origin;
const clientOrigin = toOrigin(config.CLIENT_URL);

export const env = Object.freeze({
  ...config,
  isProd,
  API_PUBLIC_URL: config.API_PUBLIC_URL.replace(/\/+$/, ''),
  clientOrigin,
  allowedOrigins: [...new Set([clientOrigin, ...config.EXTRA_ALLOWED_ORIGINS.map(toOrigin)])],
  adminEmails: config.ADMIN_EMAILS.map((email) => email.toLowerCase()),
  sessionTtlMs: config.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  guestCookieMaxAgeMs: config.GUEST_COOKIE_DAYS * 24 * 60 * 60 * 1000,
  cookieSecure:
    config.COOKIE_SAMESITE === 'none' ? true : config.COOKIE_SECURE ? config.COOKIE_SECURE === 'true' : isProd,
  googleEnabled: Boolean(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET),
  linkedinEnabled: Boolean(config.LINKEDIN_CLIENT_ID && config.LINKEDIN_CLIENT_SECRET),
  cloudinaryEnabled: Boolean(
    config.CLOUDINARY_CLOUD_NAME && config.CLOUDINARY_API_KEY && config.CLOUDINARY_API_SECRET,
  ),
});
