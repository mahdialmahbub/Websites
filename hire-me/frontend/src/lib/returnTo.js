/**
 * "Where should the user land after logging in / verifying their e-mail?"
 * The Generate modal remembers the builder; the login and verify pages ask for it afterwards.
 * Stored in sessionStorage so it survives login -> sign-up -> e-mail verification inside one tab.
 */
export const BUILDER_PATH = '/builder'; // <- change to your builder route

const KEY = 'rb.returnTo';
const isSafePath = (value) => typeof value === 'string' && /^\/(?!\/)[\w\-./?=&%#]*$/.test(value);

export const rememberReturnTo = (path = BUILDER_PATH) => {
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    /* private mode - the fallback path is used */
  }
};

/** Reads without clearing (use it for social-login links: oauthUrl('google', peekReturnTo())). */
export const peekReturnTo = (fallback = '/') => {
  try {
    const value = sessionStorage.getItem(KEY);
    return isSafePath(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

export const clearReturnTo = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};

/** Reads and clears: router.push(consumeReturnTo('/')) after a successful login / verification. */
export const consumeReturnTo = (fallback = '/') => {
  const path = peekReturnTo(fallback);
  clearReturnTo();
  return path;
};
