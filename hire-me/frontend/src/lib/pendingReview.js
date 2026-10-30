/**
 * "A guest chose Login / Register after generating a resume: show the review once they are logged in."
 * Kept in localStorage (it must survive login -> sign-up -> e-mail code -> redirect, possibly in a new tab).
 * It is forgotten after a day, so an old pending step never pops up out of the blue.
 */
const KEY = 'rb.pendingReview.v1';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const RESUME_ID = /^[a-f\d]{24}$/i;

export function rememberPendingReview(resumeId, now = Date.now()) {
  if (!RESUME_ID.test(resumeId ?? '')) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ resumeId, savedAt: now }));
  } catch {
    /* private mode: the review is simply skipped after login */
  }
}

/** @returns {{ resumeId: string } | null} null when nothing is pending, it is damaged, or it is older than a day */
export function readPendingReview(now = Date.now()) {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (!stored || !RESUME_ID.test(stored.resumeId ?? '') || !Number.isFinite(stored.savedAt)) return null;
    if (now - stored.savedAt > MAX_AGE_MS) return null;
    return { resumeId: stored.resumeId };
  } catch {
    return null;
  }
}

export function clearPendingReview() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
