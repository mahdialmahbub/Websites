/** Share helpers. Facebook, LinkedIn and X read the Open Graph tags of the shared page (see app/r/[slug]/page.jsx). */

export const facebookShareUrl = (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
export const linkedinShareUrl = (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
export const twitterShareUrl = (url, text = '') =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

/** Opens a small popup window (falls back to a new tab if popups are restricted). */
export const openSharePopup = (url) => window.open(url, '_blank', 'noopener,noreferrer,width=640,height=640');

/**
 * Instagram has NO web share URL (unlike the three above), so there is no "share to Instagram" link to build.
 * What works: the phone's native share sheet (it lists Instagram when installed). On desktop we copy the link instead.
 * @returns {Promise<'shared'|'copied'|'cancelled'>}
 */
export async function shareNatively({ url, title, text }) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ url, title, text });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled';
    }
  }
  await navigator.clipboard.writeText(url);
  return 'copied';
}

/** "Rahim Uddin - Frontend Developer" for the tweet / native share text. */
export function buildShareText(content) {
  const { fullName, professionalTitle } = content?.personalInformation ?? {};
  const who = [fullName, professionalTitle].filter(Boolean).join(' - ');
  return who ? `${who} | my resume` : 'My resume';
}
