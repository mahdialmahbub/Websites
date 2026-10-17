import { env } from '../config/env.js';

export const SESSION_COOKIE = 'rb.sid';

export const sessionCookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.COOKIE_SAMESITE,
  domain: env.COOKIE_DOMAIN,
  path: '/',
};

export const clearSessionCookie = (res) => res.clearCookie(SESSION_COOKIE, sessionCookieOptions);

const promisify = (method) => (req) =>
  new Promise((resolve, reject) => req.session[method]((err) => (err ? reject(err) : resolve())));

/** New session id (prevents session fixation) - call it whenever the privilege level changes. */
export const regenerateSession = promisify('regenerate');
export const saveSession = promisify('save');
export const destroySession = promisify('destroy');
