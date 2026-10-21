import { createHash, randomBytes } from 'node:crypto';

const base64url = (buffer) => buffer.toString('base64url');

export const generateState = () => base64url(randomBytes(32));
/** RFC 7636: 43-128 characters. 48 random bytes -> 64 characters. */
export const generateCodeVerifier = () => base64url(randomBytes(48));
export const codeChallengeS256 = (verifier) => base64url(createHash('sha256').update(verifier).digest());

/**
 * A tiny OAuth 2.0 "authorization code" client - enough for Google and LinkedIn sign-in.
 * Written against fetch + node:crypto on purpose: no third-party OAuth library to keep up to date.
 *
 * @param {object} config
 * @param {string} config.authorizationEndpoint
 * @param {string} config.tokenEndpoint
 * @param {string} config.userinfoEndpoint
 * @param {string} config.clientId
 * @param {string} config.clientSecret
 * @param {string} config.redirectUri
 * @param {string[]} config.scopes
 * @param {boolean} [config.usePkce]          send a PKCE (S256) challenge - Google supports it
 * @param {Record<string,string>} [config.authParams]  extra query params for the authorization URL
 */
export function createOAuthClient(config) {
  const { authorizationEndpoint, tokenEndpoint, userinfoEndpoint, clientId, clientSecret, redirectUri, scopes } = config;

  return {
    /** Step 1: build the URL the browser is redirected to. Keep `state` (and `codeVerifier`) in the server session. */
    createAuthorization() {
      const state = generateState();
      const codeVerifier = config.usePkce ? generateCodeVerifier() : null;

      const url = new URL(authorizationEndpoint);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('scope', scopes.join(' '));
      url.searchParams.set('state', state);
      if (codeVerifier) {
        url.searchParams.set('code_challenge', codeChallengeS256(codeVerifier));
        url.searchParams.set('code_challenge_method', 'S256');
      }
      for (const [key, value] of Object.entries(config.authParams ?? {})) url.searchParams.set(key, value);

      return { url, state, codeVerifier };
    },

    /** Step 2: trade the `code` for an access token, then read the OpenID Connect userinfo. */
    async fetchUserInfo(code, codeVerifier) {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      });
      if (config.usePkce) body.set('code_verifier', codeVerifier ?? '');

      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      const tokens = await tokenResponse.json().catch(() => ({}));
      if (!tokenResponse.ok || !tokens.access_token) {
        // Only the error code is reported - never the response body (it may echo credentials).
        throw new Error(`token exchange failed (${tokenResponse.status}${tokens.error ? `: ${tokens.error}` : ''})`);
      }

      const infoResponse = await fetch(userinfoEndpoint, {
        headers: { Authorization: `Bearer ${tokens.access_token}`, Accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      });
      if (!infoResponse.ok) throw new Error(`userinfo request failed (${infoResponse.status})`);
      return infoResponse.json();
    },
  };
}
