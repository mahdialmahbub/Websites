# Resume Builder - Backend (Milestone 2 + Phase 1)

Express 5 · MongoDB (Mongoose 9) · cookie sessions · e-mail OTP · Google + LinkedIn login · Cloudinary

**In this milestone:** auth (register, e-mail OTP verification, login/logout, forgot/reset password with OTP,
Google and LinkedIn sign-in), resumes (create, list, get, autosave, duplicate, delete), photo upload,
**user profile** (pre-fills new resumes), **"claim a guest draft after login"**, and **public share links** (Open Graph data included).
**Next milestones:** ATS score + AI (Gemini) with usage limits, reviews.

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
| GET | `/profile` | yes | the user's reusable data (the 8 builder sections; name + e-mail fall back to the account) |
| PATCH | `/profile` | yes | any subset of the 8 sections (for the profile page) |
| GET | `/resumes` | yes | dashboard list (title, design, completion %, photo, shared ...) |
| POST | `/resumes` | yes | `{}` or `{ design }` -> pre-filled from the profile. `{ clientDraftId, ...sections }` -> created from a browser draft (idempotent). Returns `{ resume, profile: { updatedSections } }` |
| GET | `/resumes/:id` | yes | full resume |
| PATCH | `/resumes/:id` | yes | autosave: any subset of the sections below, plus optional `revision` |
| POST | `/resumes/:id/sync-profile` | yes | copies the resume's non-empty sections into the profile -> `{ updatedSections }` |
| POST | `/resumes/:id/duplicate` | yes | |
| POST | `/resumes/:id/share` | yes | `{ hideContact? (default true), rotate? }` -> `{ share: { slug, url, hideContact } }` - same link every time |
| DELETE | `/resumes/:id/share` | yes | turns the link off |
| GET | `/public/resumes/:slug` | - | what a share link shows (+ `og` data for the Open Graph tags); contact details hidden unless the owner allowed them |
| DELETE | `/resumes/:id` | yes | |

### Response format

```jsonc
{ "success": true, "data": { ... }, "message": "optional" }
{ "success": false, "error": { "code": "INVALID_OTP", "message": "...", "details": { "fieldErrors": {...}, "retryAfterSeconds": 42 } } }
```

Codes you will handle in the UI: `VALIDATION_ERROR`, `INVALID_CREDENTIALS`, `EMAIL_NOT_VERIFIED`, `EMAIL_TAKEN`,
`INVALID_OTP`, `OTP_RATE_LIMITED` (use `retryAfterSeconds` for the resend timer), `OTP_ATTEMPTS_EXCEEDED`,
`RESET_EXPIRED`, `UNAUTHENTICATED`, `RESUME_NOT_FOUND`, `REVISION_CONFLICT`, `RATE_LIMITED`.

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

Autosave stores **drafts**: e-mail / phone / dates are not format-checked on the server (the UI validates), so a half-typed value never blocks saving.
The server still enforces sizes, strips control characters and rejects `javascript:`-style links.

## Guest draft -> account -> profile

1. A guest builds in the browser (draft in localStorage). Nothing is sent to the server.
2. After login / sign-up the frontend calls `POST /resumes` with the whole draft and a `clientDraftId`. Calling it twice returns the same resume.
3. The API creates the resume and tops up the **profile**: sections that are still empty are filled (a new account gets everything; an existing profile is never overwritten). `personalInformation` is merged field by field.
4. `POST /resumes` without content starts from the profile, so the next resume is pre-filled.
5. `POST /resumes/:id/sync-profile` (called on every Generate) copies the resume's non-empty sections into the profile - empty sections never wipe it.

## How the main flows work

- **Sign up:** register -> code by e-mail -> `verify-email` -> logged in. Registering again with an unverified address overwrites the pending sign-up and sends a new code.
- **Login:** wrong credentials always answer the same generic error. A correct password on an unverified account sends a new code and answers `EMAIL_NOT_VERIFIED`.
- **Forgot password:** `forgot-password` -> `verify-reset-otp` -> `reset-password`. The window between the last two steps lives in the server-side session, so no token appears in a URL.
- **Social login:** the browser is sent to Google/LinkedIn (state + PKCE), comes back to `/api/auth/<provider>/callback`, and is redirected to the frontend. Accounts are linked by a **provider-verified** e-mail address.
- **OTP rules:** 6 digits, valid 10 minutes, single use, 60 s between codes, max 5 codes per hour, max 5 wrong guesses per code. Only an HMAC of the code is stored.

## Security decisions

- Public pages: a share link is an unguessable 12-character id; e-mail and phone are hidden by default; the page is `noindex`.
- Sessions: random id in an `httpOnly` cookie, data in MongoDB (`sessions` collection), new id on login (no session fixation), 7 days rolling.
  A password reset bumps `authVersion`, which invalidates every other session of that user.
- CSRF: `SameSite` cookie + every non-GET request must come from an allowed `Origin` (`CLIENT_URL`, `EXTRA_ALLOWED_ORIGINS`).
- Passwords: scrypt (N=2^15, r=8, p=3 - an OWASP-listed profile) from Node's own `crypto`: no native add-on, so `npm install` works on Windows without Visual Studio. Hashes carry their parameters and are upgraded on login. Login timing is equalised for unknown e-mails.
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
- **`npm install` fails with `EPERM ... rmdir` on Windows** - something (VS Code, antivirus, a running `node`) holds files in `node_modules`. Close them, delete the folder (`Remove-Item -Recurse -Force node_modules`) and install again.
- **Login works in Postman but not in the browser** - frontend and API are not same-site or `CLIENT_URL` does not match the page origin (`403 BAD_ORIGIN`).
- **Social login says `oauth_state`** - the session cookie was lost between the redirect and the callback (check the points above, and that the redirect URI registered at Google/LinkedIn is exactly `<API_PUBLIC_URL>/api/auth/<provider>/callback`).


---

## Phase 1 additions (guests, catalog, reviews, admin API)

**Run once after pulling:** `npm install`, set `ADMIN_EMAILS=you@example.com` in `.env`, then `npm run seed`
(creates the categories + templates and gives any category-less template the "General" category).

**Changes you will notice**
- `/dashboard` is gone: `POST_LOGIN_PATH` now defaults to `/`.
- No resume limit any more (`MAX_RESUMES_PER_USER` removed), and any number of resumes per template.
- **Guests are saved in the database.** The first `POST /resumes` gives the visitor an httpOnly cookie `rb.gid`; every resume route
  (create, get, autosave, duplicate, generate, share, delete) works for a guest OR a logged-in user. The owner always comes from
  the session / cookie, never from the request body.
- **Claim at login:** every login path (password, e-mail verify, Google, LinkedIn) moves the guest's resumes to the account and tops up
  the profile without overwriting non-empty data. `POST /resumes/claim` does the same on demand (idempotent; optional `{ draft }`).
- Guests cannot upload photos yet (upload needs a login).

| Method | Path | Who | Notes |
|---|---|---|---|
| GET | `/categories` | public | active categories that have templates (`templateCount`) |
| GET | `/templates?category=<slug>&page=&limit=` | public | active templates, paginated, `category` + `pagination` in the answer |
| GET | `/templates/:slug` | public | one template (404 when inactive / missing) |
| POST | `/resumes` | guest or user | always a NEW resume; `design.templateId` must be an active template |
| POST | `/resumes/:id/generate` | guest or user | validates, creates the share link (same link every time), `status: generated`; merges into the profile for users. Safe to double click |
| GET | `/resumes?page=&limit=` | user | `{ resumes[], pagination }`, each with `templateName`, `atsScore`, `status`, `shareUrl` |
| POST | `/resumes/claim` | user | `{ draft? }` -> `{ claimed, updatedSections }` |
| POST | `/reviews` | guest or user | `{ resumeId, rating 1-5, comment?, guestName?, website (honeypot, leave empty) }`; only for your own resume; 10 per hour per IP |
| GET/POST | `/admin/categories` | admin | list / create |
| PATCH/DELETE | `/admin/categories/:id` | admin | rename (slug kept unless `regenerateSlug`) / delete (`409 CATEGORY_IN_USE`, or `?reassignTo=<categoryId>`) |
| GET/POST | `/admin/templates` | admin | `category: { id }` or `{ name }` (a new name creates the category automatically) |
| PATCH/DELETE | `/admin/templates/:id` | admin | |
| GET | `/admin/reviews?status=&page=` | admin | |
| PATCH | `/admin/reviews/:id` | admin | `{ status: pending \| approved \| rejected }` |

Admin = a verified account whose e-mail is in `ADMIN_EMAILS` (there is no admin dashboard in the website; use Postman / Thunder Client).
New error codes: `CATEGORY_EXISTS`, `CATEGORY_IN_USE`, `CATEGORY_NOT_FOUND`, `TEMPLATE_EXISTS`, `TEMPLATE_NOT_FOUND`, `REVIEW_NOT_FOUND`, `FORBIDDEN`.

`npm test` runs the unit tests (merge/claim planning, generate rules, slugs).
