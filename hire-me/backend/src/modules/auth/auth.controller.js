import { env } from '../../config/env.js';
import { logger } from '../../lib/logger.js';
import { ok } from '../../lib/respond.js';
import { ApiError } from '../../lib/ApiError.js';
import { clearSessionCookie, saveSession } from '../../lib/session.js';
import { toPublicUser } from '../users/user.model.js';
import * as auth from './auth.service.js';
import * as oauth from './oauth.service.js';

// ───────── e-mail + password ─────────

export const register = async (req, res) => {
  const result = await auth.register(req.valid.body);
  ok(res, result, 'We sent a 6-digit code to your email', 201);
};

export const verifyEmail = async (req, res) => {
  const user = await auth.verifyEmail(req.valid.body, req);
  ok(res, { user: toPublicUser(user) }, 'Email verified');
};

export const resendOtp = async (req, res) => {
  const result = await auth.requestOtp(req.valid.body);
  ok(res, result, 'If the account exists, a new code is on its way');
};

export const forgotPassword = async (req, res) => {
  const result = await auth.requestOtp({ email: req.valid.body.email, purpose: 'reset_password' });
  ok(res, result, 'If an account exists for this email, we sent a code');
};

export const login = async (req, res) => {
  const user = await auth.login(req.valid.body, req);
  ok(res, { user: toPublicUser(user) }, 'Logged in');
};

export const logout = async (req, res) => {
  await auth.logout(req);
  clearSessionCookie(res);
  ok(res, null, 'Logged out');
};

export const verifyResetOtp = async (req, res) => {
  await auth.verifyResetOtp(req.valid.body, req);
  ok(res, null, 'Code verified. You can now choose a new password');
};

export const resetPassword = async (req, res) => {
  await auth.resetPassword(req.valid.body, req);
  clearSessionCookie(res);
  ok(res, null, 'Password updated. Please log in with your new password');
};

// ───────── Google / LinkedIn ─────────

export const providers = (_req, res) => ok(res, { google: env.googleEnabled, linkedin: env.linkedinEnabled });

/** Only same-site paths are accepted as "where to go after login" (prevents open redirects). */
const safeNext = (value) =>
  typeof value === 'string' && /^\/(?!\/)[\w\-./?=&%#]*$/.test(value) ? value : env.POST_LOGIN_PATH;

const redirectToLogin = (res, reason) => res.redirect(`${env.clientOrigin}/login?error=${reason}`);

export const oauthStart = async (req, res) => {
  const { provider } = req.valid.params;
  if (!oauth.isEnabled(provider)) return redirectToLogin(res, 'oauth_not_configured');

  const { url, state, codeVerifier } = oauth.createAuthorization(provider);
  req.session.oauth = { provider, state, codeVerifier, next: safeNext(req.valid.query.next) };
  await saveSession(req);
  res.redirect(url.toString());
};

export const oauthCallback = async (req, res) => {
  const { provider } = req.valid.params;
  if (!oauth.isEnabled(provider)) return redirectToLogin(res, 'oauth_not_configured');

  const saved = req.session?.oauth;
  if (req.session) delete req.session.oauth;

  const { code, state, error } = req.query;
  if (error || typeof code !== 'string' || typeof state !== 'string') return redirectToLogin(res, 'oauth_cancelled');
  if (!saved || saved.provider !== provider || saved.state !== state) return redirectToLogin(res, 'oauth_state');

  try {
    const profile = await oauth.fetchProfile(provider, code, saved.codeVerifier);
    const user = await auth.loginWithOAuthProfile(profile);
    await auth.establishSession(req, user);
    res.redirect(`${env.clientOrigin}${saved.next}`);
  } catch (err) {
    logger.error(`[oauth:${provider}]`, err?.message ?? err);
    redirectToLogin(res, err instanceof ApiError ? err.code.toLowerCase() : 'oauth_failed');
  }
};
