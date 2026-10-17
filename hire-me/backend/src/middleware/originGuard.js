import { env } from '../config/env.js';
import { ApiError } from '../lib/ApiError.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * CSRF protection for cookie sessions.
 * Browsers always send an Origin header on POST/PATCH/PUT/DELETE, so a request that comes from
 * another website is rejected. Requests without an Origin (curl, Postman, server-to-server) pass.
 */
export function originGuard(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin');
  if (origin && !env.allowedOrigins.includes(origin)) {
    throw new ApiError(403, 'BAD_ORIGIN', 'This request origin is not allowed');
  }
  next();
}
