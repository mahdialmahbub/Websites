/**
 * Share helpers. Facebook, LinkedIn and X read the Open Graph tags of the shared page (app/r/[slug]/page.jsx).
 * Everything here is a plain link or a small browser call: no SDKs, no tracking scripts.
 */

const enc = encodeURIComponent;

export const facebookShareUrl = (url) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
export const linkedinShareUrl = (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
export const xShareUrl = (url, text = '') => `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(text)}`;
export const whatsappShareUrl = (url, text = '') => `https://wa.me/?text=${enc([text, url].filter(Boolean).join(' '))}`;
export const telegramShareUrl = (url, text = '') => `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`;
export const emailShareUrl = (url, { subject = 'My resume', text = '' } = {}) =>
  `mailto:?subject=${enc(subject)}&body=${enc([text, url].filter(Boolean).join('\n\n'))}`;

/** "Rahim Uddin - Frontend Developer | my resume" for the post / message text. */
export function buildShareText(content) {
  const { fullName, professionalTitle } = content?.personalInformation ?? {};
  const who = [fullName, professionalTitle].filter(Boolean).join(' - ');
  return who ? `${who} | my resume` : 'My resume';
}

/** The share buttons in the order they are shown. `href` builds the link for a given page address. */
export const SHARE_TARGETS = [
  { id: 'facebook', label: 'Facebook', href: (url) => facebookShareUrl(url) },
  { id: 'linkedin', label: 'LinkedIn', href: (url) => linkedinShareUrl(url) },
  { id: 'x', label: 'X', href: (url, text) => xShareUrl(url, text) },
  { id: 'whatsapp', label: 'WhatsApp', href: (url, text) => whatsappShareUrl(url, text) },
  { id: 'telegram', label: 'Telegram', href: (url, text) => telegramShareUrl(url, text) },
  { id: 'email', label: 'Email', href: (url, text) => emailShareUrl(url, { subject: text, text: 'Here is my resume:' }) },
];

/** True where the phone / browser has its own share sheet (it lists every app installed, Instagram included). */
export const canShareNatively = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';

/** @returns {Promise<'shared'|'cancelled'|'failed'>} */
export async function shareNatively({ url, title, text }) {
  try {
    await navigator.share({ url, title, text });
    return 'shared';
  } catch (error) {
    return error?.name === 'AbortError' ? 'cancelled' : 'failed';
  }
}

/** Copies text. Uses the modern clipboard API, with an old-style fallback for http pages / older browsers. @returns {Promise<boolean>} */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const box = document.createElement('textarea');
      box.value = text;
      box.setAttribute('readonly', '');
      box.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(box);
      box.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(box);
      return copied;
    } catch {
      return false;
    }
  }
}
