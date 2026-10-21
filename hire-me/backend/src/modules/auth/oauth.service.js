import { env } from '../../config/env.js';
import { createOAuthClient } from '../../lib/oauth.js';

const SCOPES = ['openid', 'profile', 'email'];
const callbackUrl = (provider) => `${env.API_PUBLIC_URL}/api/auth/${provider}/callback`;

const factories = {
  google: () =>
    createOAuthClient({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: callbackUrl('google'),
      scopes: SCOPES,
      usePkce: true,
      authParams: { prompt: 'select_account' }, // let people with several Google accounts choose
    }),

  linkedin: () =>
    createOAuthClient({
      authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
      userinfoEndpoint: 'https://api.linkedin.com/v2/userinfo',
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
      redirectUri: callbackUrl('linkedin'),
      scopes: SCOPES,
      usePkce: false, // LinkedIn's web flow does not use PKCE
    }),
};

const clients = {};
const client = (provider) => (clients[provider] ??= factories[provider]());

export const isEnabled = (provider) =>
  provider === 'google' ? env.googleEnabled : provider === 'linkedin' ? env.linkedinEnabled : false;

/** Step 1: where to send the browser. `state` (+ PKCE verifier for Google) must be remembered server-side. */
export const createAuthorization = (provider) => client(provider).createAuthorization();

const isTrue = (value) => value === true || value === 'true';

/**
 * Step 2: exchange the code and read the profile (OpenID Connect userinfo).
 * @returns {{ provider: string, providerId: string, email?: string, emailVerified: boolean, name?: string, picture?: string }}
 */
export async function fetchProfile(provider, code, codeVerifier) {
  const info = await client(provider).fetchUserInfo(code, codeVerifier);
  return {
    provider,
    providerId: info.sub,
    // LinkedIn marks email / email_verified as optional - when missing we refuse to link the account.
    email: info.email?.toLowerCase(),
    emailVerified: isTrue(info.email_verified),
    name: info.name || [info.given_name, info.family_name].filter(Boolean).join(' '),
    picture: info.picture,
  };
}
