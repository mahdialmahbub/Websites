import { ApiError } from '../lib/ApiError.js';
import { clearSessionCookie, destroySession } from '../lib/session.js';
import { User } from '../modules/users/user.model.js';

/**
 * Loads the logged-in user from the session.
 * required=false -> returns null for visitors who are not logged in (guests).
 * A session that exists but is no longer valid always answers 401, so the UI can ask for a new login.
 */
export async function loadSessionUser(req, res, { required }) {
  const userId = req.session?.userId;
  if (!userId) {
    if (required) throw new ApiError(401, 'UNAUTHENTICATED', 'Please log in to continue');
    return null;
  }

  const user = await User.findById(userId);

  // authVersion changes on password reset, which logs the user out everywhere.
  if (!user || user.authVersion !== req.session.authVersion) {
    await destroySession(req).catch(() => {});
    clearSessionCookie(res);
    throw new ApiError(401, 'UNAUTHENTICATED', 'Your session has expired. Please log in again.');
  }
  return user;
}

/** Loads the logged-in user into req.user, or answers 401. */
export async function requireAuth(req, res, next) {
  req.user = await loadSessionUser(req, res, { required: true });
  next();
}
