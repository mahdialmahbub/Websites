import { ApiError } from '../lib/ApiError.js';
import { clearSessionCookie, destroySession } from '../lib/session.js';
import { User } from '../modules/users/user.model.js';

/** Loads the logged-in user into req.user, or answers 401. */
export async function requireAuth(req, res, next) {
  const userId = req.session?.userId;
  if (!userId) throw new ApiError(401, 'UNAUTHENTICATED', 'Please log in to continue');

  const user = await User.findById(userId);

  // authVersion changes on password reset, which logs the user out everywhere.
  if (!user || user.authVersion !== req.session.authVersion) {
    await destroySession(req).catch(() => {});
    clearSessionCookie(res);
    throw new ApiError(401, 'UNAUTHENTICATED', 'Your session has expired. Please log in again.');
  }

  req.user = user;
  next();
}
