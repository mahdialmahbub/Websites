import { Google, LinkedIn, generateCodeVerifier, generateState } from 'arctic';
import { env } from '../../config/env.js';

const SCOPES = ['openid', 'profile', 'email'];
const callbackUrl = (provider) => `${env.API_PUBLIC_URL}/api/auth/${provider}/callback`;

let google;
let linkedin;
const googleClient = () =>
  (google ??= new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, callbackUrl('google')));
const linkedinClient = () =>
  (linkedin ??= new LinkedIn(env.LINKEDIN_CLIENT_ID, env.LINKEDIN_CLIENT_SECRET, callbackUrl('linkedin')));

export const isEnabled = (provider) =>
  provider === 'google' ? env.googleEnabled : provider === 'linkedin' ? env.linkedinEnabled : false;

/** Step 1: where to send the browser. `state` (+ PKCE verifier for Google) must be remembered server-side. */
export function createAuthorization(provider) {
  const state = generateState();

  if (provider === 'google') {
    const codeVerifier = generateCodeVerifier();
    const url = googleClient().createAuthorizationURL(state, codeVerifier, SCOPES);
    return { url, state, codeVerifier };
  }

  const url = linkedinClient().createAuthorizationURL(state, SCOPES);
  return { url, state, codeVerifier: null };
}

async function getJson(url, accessToken) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`userinfo request failed (${res.status})`);
  return res.json();
}

const isTrue = (value) => value === true || value === 'true';

/**
 * Step 2: exchange the code for tokens and read the profile (OpenID Connect userinfo).
 * @returns {{ provider: string, providerId: string, email?: string, emailVerified: boolean, name?: string, picture?: string }}
 */
export async function fetchProfile(provider, code, codeVerifier) {
  if (provider === 'google') {
    const tokens = await googleClient().validateAuthorizationCode(code, codeVerifier);
    const info = await getJson('https://openidconnect.googleapis.com/v1/userinfo', tokens.accessToken());
    return {
      provider,
      providerId: info.sub,
      email: info.email?.toLowerCase(),
      emailVerified: isTrue(info.email_verified),
      name: info.name,
      picture: info.picture,
    };
  }

  const tokens = await linkedinClient().validateAuthorizationCode(code);
  const info = await getJson('https://api.linkedin.com/v2/userinfo', tokens.accessToken());
  return {
    provider,
    providerId: info.sub,
    // LinkedIn marks both fields as optional - when they are missing we refuse to link the account.
    email: info.email?.toLowerCase(),
    emailVerified: isTrue(info.email_verified),
    name: info.name || [info.given_name, info.family_name].filter(Boolean).join(' '),
    picture: info.picture,
  };
}
