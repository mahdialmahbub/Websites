# Resume Builder - Backend (Milestone 1)

Express 5 · MongoDB (Mongoose 9) · cookie sessions · e-mail OTP · Google + LinkedIn login · Cloudinary

**In this milestone:** auth (register, e-mail OTP verification, login/logout, forgot/reset password with OTP,
Google and LinkedIn sign-in), resumes (create, list, get, autosave, duplicate, delete) and photo upload.
**Next milestones:** ATS score + AI (Gemini) with usage limits, public share links + Open Graph, reviews.

## Quick start

Requirements: Node.js 22+ (24 LTS recommended) and a MongoDB Atlas cluster.

```bash
npm install
cp .env.example .env        # fill MONGODB_URI, SESSION_SECRET, OTP_SECRET, CLIENT_URL (comments explain every key)
npm run dev                 # http://localhost:5000/api/health
```

With `MAIL_PROVIDER=console` the OTP codes are printed in the terminal, so everything can be tested
without an e-mail account. Google, LinkedIn and Cloudinary are optional until you want those features.

## API (prefix `/api`, JSON)

| Method | Path | Auth | Body / notes |
|---|---|---|---|
| POST | `/auth/register` | - | `{ name, email, password }` -> sends a 6-digit code |
| POST | `/auth/verify-email` | - | `{ email, otp }` -> verifies and logs in |
| POST | `/auth/resend-otp` | - | `{ email, purpose: "verify_email" \| "reset_password" }` |
| POST | `/auth/login` | - | `{ email, password }` - `403 EMAIL_NOT_VERIFIED` if the mailbox was never confirmed |
| POST | `/auth/logout` | - | |
| POST | `/auth/forgot-password` | - | `{ email }` (same answer whether the account exists or not) |
| POST | `/auth/verify-reset-otp` | - | `{ email, otp }` -> opens a 10-minute reset window in the session |
| POST | `/auth/reset-password` | - | `{ password }` (needs the previous step) - logs the user out everywhere |
| GET | `/auth/providers` | - | `{ google, linkedin }` - which social buttons are configured |
| GET | `/auth/google` · `/auth/linkedin` | - | start social login (browser navigation, optional `?next=/path`) |
| GET | `/users/me` | yes | current user |
| PATCH | `/users/me` | yes | `{ name }` |
| POST | `/uploads/photo` | yes | multipart field `photo` (jpg/png/webp, max 3 MB) -> `{ photo: { url, publicId } }` |
| DELETE | `/uploads/photo?publicId=` | yes | removes an unused uploaded photo |
| GET | `/resumes` | yes | dashboard list (title, design, completion %, photo ...) |
| POST | `/resumes` | yes | `{ title?, design?: { templateId, color, font } }` |
| GET | `/resumes/:id` | yes | full resume |
| PATCH | `/resumes/:id` | yes | autosave: any subset of the sections below, plus optional `revision` |
| POST | `/resumes/:id/duplicate` | yes | |
| DELETE | `/resumes/:id` | yes | |

### Response format

```jsonc
{ "success": true, "data": { ... }, "message": "optional" }
{ "success": false, "error": { "code": "INVALID_OTP", "message": "...", "details": { "fieldErrors": {...}, "retryAfterSeconds": 42 } } }
```

Codes you will handle in the UI: `VALIDATION_ERROR`, `INVALID_CREDENTIALS`, `EMAIL_NOT_VERIFIED`, `EMAIL_TAKEN`,
`INVALID_OTP`, `OTP_RATE_LIMITED` (use `retryAfterSeconds` for the resend timer), `OTP_ATTEMPTS_EXCEEDED`,
`RESET_EXPIRED`, `UNAUTHENTICATED`, `RESUME_NOT_FOUND`, `RESUME_LIMIT_REACHED`, `REVISION_CONFLICT`, `RATE_LIMITED`.

### Resume sections (`PATCH /resumes/:id`)

A section you send **replaces** the stored one. Everything else stays untouched, except `design` which is merged key by key.
Dates are `YYYY-MM-DD` strings. Array items may carry a client generated `id` (kept stable for React keys); the server adds one if missing.

| Section | Shape |
|---|---|
| `title` | string |
| `design` | `{ templateId?, color? (#rrggbb), font? }` |
| `personalInformation` | `{ photo: { url, publicId } \| null, fullName, email, phone, location, professionalTitle, linkedin, website }` |
| `professionalSummary` | string (max 2000) |
| `workExperience[]` | `{ id?, companyName, jobTitle, employeeType, location, startDate, endDate, currentlyWorking, jobDescription }` |
| `education[]` | `{ id?, institutionName, degree, fieldOfStudy, startDate, endDate, currentlyStudying, gpa, description }` |
| `projects[]` | `{ id?, projectName, projectType, role, keyResponsibilities, keyAchievements, technologies[], projectUrl, projectDescription }` |
| `skills` | `string[]` (trimmed, de-duplicated) |
| `languages[]` | `{ id?, name, level }` |
| `references[]` | `{ id?, name, jobTitle, company, relationship, email, phone }` |
| `targetJob` | `{ title, description }` (used by the ATS job-match later) |
| `revision` | number - optional; when sent, the save only succeeds if nobody saved in between (`409 REVISION_CONFLICT`) |

The response is only `{ revision, updatedAt }`.

## How the main flows work

- **Sign up:** register -> code by e-mail -> `verify-email` -> logged in. Registering again with an unverified address overwrites the pending sign-up and sends a new code.
- **Login:** wrong credentials always answer the same generic error. A correct password on an unverified account sends a new code and answers `EMAIL_NOT_VERIFIED`.
- **Forgot password:** `forgot-password` -> `verify-reset-otp` -> `reset-password`. The window between the last two steps lives in the server-side session, so no token appears in a URL.
- **Social login:** the browser is sent to Google/LinkedIn (state + PKCE), comes back to `/api/auth/<provider>/callback`, and is redirected to the frontend. Accounts are linked by a **provider-verified** e-mail address.
- **OTP rules:** 6 digits, valid 10 minutes, single use, 60 s between codes, max 5 codes per hour, max 5 wrong guesses per code. Only an HMAC of the code is stored.

## Security decisions

- Sessions: random id in an `httpOnly` cookie, data in MongoDB (`sessions` collection), new id on login (no session fixation), 7 days rolling.
  A password reset bumps `authVersion`, which invalidates every other session of that user.
- CSRF: `SameSite` cookie + every non-GET request must come from an allowed `Origin` (`CLIENT_URL`, `EXTRA_ALLOWED_ORIGINS`).
- Passwords: Argon2id (OWASP profile). Login timing is equalised for unknown e-mails.
- Input: every body/param is validated with zod; unknown keys are dropped; control characters are stripped; links must be http(s).
- Uploads: type + size limits, Cloudinary re-encodes to JPEG, and users can only attach/delete images inside their own Cloudinary folder.
- Rate limits per IP on the whole API and tighter ones on auth/OTP/upload routes.
- Pre-account-takeover protection: an unverified password sign-up is discarded when the real owner signs in with Google/LinkedIn.

## Deploying (cookies)

The session cookie must be sent by the browser on every API call, so frontend and API must be **same-site**:

1. **Recommended:** your own domain, e.g. `app.example.com` (Next.js) and `api.example.com` (Express).
   Set `COOKIE_SAMESITE=lax`, `COOKIE_DOMAIN=.example.com`, `CLIENT_URL=https://app.example.com`,
   `API_PUBLIC_URL=https://api.example.com`, `TRUST_PROXY=1`, and set `NEXT_PUBLIC_API_URL=https://api.example.com/api` in the frontend.
2. **No custom domain yet:** use the Next.js rewrite from `frontend/` so the browser only talks to the Next.js origin.
   Set `API_PUBLIC_URL` to the **frontend** URL, `TRUST_PROXY=1`. (IP-based rate limits then see the proxy's IP - fine for a start, use option 1 later.)
3. Different sites without rewrites (`vercel.app` + `onrender.com`) needs `COOKIE_SAMESITE=none` and still breaks in browsers that block third-party cookies. Avoid it.

Some hosts block outgoing SMTP ports. If e-mail fails there, switch `MAIL_PROVIDER` to `resend` or `sendgrid` (HTTPS API, no SMTP).

## Smoke test

With `MAIL_PROVIDER=console` (use Postman / Thunder Client, or `curl.exe` on Windows):

```bash
curl -i -c jar.txt -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Passw0rd!123"}' http://localhost:5000/api/auth/register
# the 6-digit code is printed in the server terminal
curl -i -b jar.txt -c jar.txt -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}' http://localhost:5000/api/auth/verify-email
curl -b jar.txt -c jar.txt -H "Content-Type: application/json" -d '{"title":"My first resume"}' http://localhost:5000/api/resumes
curl -b jar.txt http://localhost:5000/api/resumes
```

## Troubleshooting

- **Server exits with "Invalid environment configuration"** - the list shows exactly which `.env` values are missing or invalid.
- **`npm install` cannot find a version** - run `npm install <package>@latest` for that package; the code only uses the stable APIs.
- **Login works in Postman but not in the browser** - frontend and API are not same-site or `CLIENT_URL` does not match the page origin (`403 BAD_ORIGIN`).
- **Social login says `oauth_state`** - the session cookie was lost between the redirect and the callback (check the points above, and that the redirect URI registered at Google/LinkedIn is exactly `<API_PUBLIC_URL>/api/auth/<provider>/callback`).
