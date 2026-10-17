import { API_URL } from '../store/api/baseApi';

/**
 * Google / LinkedIn login are full-page redirects (not fetch calls):
 *   <a href={oauthUrl('google')}>Continue with Google</a>
 *
 * @param {'google'|'linkedin'} provider
 * @param {string} [next] frontend path to open after login, e.g. "/builder"
 */
export const oauthUrl = (provider, next = '/') =>
  `${API_URL}/auth/${provider}?next=${encodeURIComponent(next)}`;
