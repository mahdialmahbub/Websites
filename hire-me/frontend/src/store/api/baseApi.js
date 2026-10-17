import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * '/api' goes through the Next.js rewrite (same origin: no CORS, first-party cookies).
 * Set NEXT_PUBLIC_API_URL only if you want to call the Express server directly.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

/**
 * Every failed request ends up with this shape in `error` (hooks) or in `.unwrap()` catch blocks.
 * @typedef {Object} ApiError
 * @property {number|string} status            HTTP status, or "FETCH_ERROR" when the server is unreachable
 * @property {string} code                     "INVALID_CREDENTIALS" | "EMAIL_NOT_VERIFIED" | "INVALID_OTP" | "OTP_RATE_LIMITED" | "VALIDATION_ERROR" | "REVISION_CONFLICT" | ...
 * @property {string} message                  safe to show to the user
 * @property {Record<string, string[]>|null} fieldErrors   { "personalInformation.email": ["Enter a valid email address"] }
 * @property {number|null} retryAfterSeconds   set when the server asks the client to wait (OTP resend, rate limits)
 * @property {object|null} details             raw extra data, e.g. { email } for EMAIL_NOT_VERIFIED
 */

const rawBaseQuery = fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' });

/**
 * Wraps fetchBaseQuery so that
 *  - successful responses are unwrapped:  { success: true, data }  ->  data
 *  - every error has the same ApiError shape
 *  - an expired session clears the whole RTK Query cache
 */
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const apiError = result.error.data?.error;
    const isNetworkError = result.error.status === 'FETCH_ERROR';

    /** @type {ApiError} */
    const error = {
      status: result.error.status,
      code: apiError?.code ?? (isNetworkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR'),
      message:
        apiError?.message ??
        (isNetworkError ? 'Cannot reach the server. Check your connection.' : 'Something went wrong. Please try again.'),
      fieldErrors: apiError?.details?.fieldErrors ?? null,
      retryAfterSeconds: apiError?.details?.retryAfterSeconds ?? null,
      details: apiError?.details ?? null,
    };

    // Session expired while the user was on a protected page (getMe answering 401 is the normal "logged out" case).
    if (error.code === 'UNAUTHENTICATED' && api.endpoint !== 'getMe') {
      api.dispatch(baseApi.util.resetApiState());
    }
    return { error };
  }

  const body = result.data;
  if (body && typeof body === 'object' && 'success' in body) return { ...result, data: body.data };
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Me', 'Resume', 'ResumeList', 'Profile'],
  endpoints: () => ({}),
});
