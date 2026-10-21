import { randomBytes } from 'node:crypto';
import { env } from '../config/env.js';
import { sessionCookieOptions } from './session.js';

/**
 * Guests (not logged in) get a random, unguessable id in an httpOnly cookie.
 * Their resumes are saved in the database under that id. The id is the only proof of ownership,
 * so it is 128 bits of randomness and never readable by JavaScript.
 */
export const GUEST_COOKIE = 'rb.gid';
const GUEST_ID = /^[a-f0-9]{32}$/;

const guestCookieOptions = { ...sessionCookieOptions, maxAge: env.guestCookieMaxAgeMs };

/** Reads one cookie from the raw header (the API does not use a cookie-parser). */
function readCookie(req, name) {
  const header = req.headers?.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index === -1 || part.slice(0, index).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(index + 1).trim());
    } catch {
      return null;
    }
  }
  return null;
}

/** The guest id from the cookie, or null when missing / malformed. */
export function readGuestId(req) {
  const value = readCookie(req, GUEST_COOKIE);
  return value && GUEST_ID.test(value) ? value : null;
}

export function issueGuestId(res) {
  const guestId = randomBytes(16).toString('hex');
  res.cookie(GUEST_COOKIE, guestId, guestCookieOptions);
  return guestId;
}

export const clearGuestCookie = (res) => res.clearCookie(GUEST_COOKIE, { ...sessionCookieOptions });
