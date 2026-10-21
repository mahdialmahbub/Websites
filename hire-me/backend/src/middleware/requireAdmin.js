import { env } from '../config/env.js';
import { ApiError } from '../lib/ApiError.js';

/** Admin = a verified account whose e-mail is listed in ADMIN_EMAILS. Use it AFTER requireAuth. */
export const isAdmin = (user) => Boolean(user?.emailVerified && env.adminEmails.includes(user.email));

export function requireAdmin(req, _res, next) {
  if (!isAdmin(req.user)) throw new ApiError(403, 'FORBIDDEN', 'Only administrators can do this');
  next();
}
