import { ApiError } from '../lib/ApiError.js';
import { issueGuestId, readGuestId } from '../lib/guest.js';
import { loadSessionUser } from './requireAuth.js';

export const userOwner = (user) => ({
  kind: 'user',
  user,
  userId: user._id,
  key: String(user._id),
  filter: { user: user._id },
  create: { user: user._id },
});

/** For routes behind requireAuth that need req.owner too. */
export function accountOwner(req, _res, next) {
  req.owner = userOwner(req.user);
  next();
}

/**
 * "Who owns the data in this request?" - sets req.owner, and req.user when logged in.
 *
 *   owner.kind    'user' | 'guest'
 *   owner.filter  spread it into every MongoDB query:  Resume.findOne({ _id, ...owner.filter })
 *   owner.create  spread it into new documents:        Resume.create({ ...owner.create, ... })
 *   owner.key     string id used for the photo folder ownership check
 *
 * The owner is ALWAYS taken from the session / httpOnly cookie, never from the request body.
 *
 * createGuest: true  -> a visitor without a cookie gets one (use it only on routes that create data)
 * createGuest: false -> a visitor without a cookie gets 404 (nothing of theirs can exist yet)
 */
export const resolveOwner =
  ({ createGuest = false } = {}) =>
  async (req, res, next) => {
    const user = await loadSessionUser(req, res, { required: false });
    if (user) {
      req.user = user;
      req.owner = userOwner(user);
      return next();
    }

    const guestId = readGuestId(req) ?? (createGuest ? issueGuestId(res) : null);
    if (!guestId) throw new ApiError(404, 'RESUME_NOT_FOUND', 'Resume not found');

    req.owner = {
      kind: 'guest',
      user: null,
      userId: null,
      guestId,
      key: `guest-${guestId}`,
      filter: { guestId },
      create: { guestId },
    };
    next();
  };
