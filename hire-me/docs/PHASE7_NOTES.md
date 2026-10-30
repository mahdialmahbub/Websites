# Phase 7 - post-generate flow + review

Copy `backend/` and `frontend/` files over the project (same paths). No new packages.

## The exact order
1. **Generate** -> share dialog.
2. The share dialog closes (Close, Escape or clicking outside):
   - **guest** -> "Keep your resume safe with a free account" dialog: 4 real benefits (resumes saved, edit any time, auto-fill, open on any
     device) and **Login / Register / Maybe later**. Closing it counts as "Maybe later".
   - **logged in** -> this step is skipped.
3. **Review dialog ALWAYS opens** after every Generate (guests and users).
4. Review sent or skipped (Skip, Escape or the X count as skipped):
   - **logged in -> /my-resume** - **guest -> /create-resume**
- **Guest picks Login / Register** (in the benefits dialog, or the Login button inside the share dialog): the pending review is remembered
  in the browser. After logging in (or signing up + e-mail code) the server has already moved the guest's resume to the account, the review opens
  **once** on whatever page they land on, and then they go to **/my-resume**. A pending step older than a day is ignored.

## The review dialog (your design, now real)
Bad / Decent / Excellent (saved as 1 / 3 / 5), a comment (1000 characters), and for guests an optional name. A rating is required (clear message),
sending shows a spinner, errors show the server's message with "Try again", success shows "Thank you!" and continues by itself after a moment
(or at once with Continue). Spam protection: hidden honeypot field + 10 reviews per hour per IP + you can only review your own resume.

## Changed / new
- New: `store/flow/*`, `components/flow/PostGenerateFlow.jsx` (mounted in the layout, it only renders dialogs), `LoginBenefitsModal`, `ReviewModal`,
  `store/api/reviewApi.js`, `lib/pendingReview.js`.
- Rewritten: `RatingModal.jsx` (now a working form). Changed: `Modal.jsx` (reports only closes the user caused), `ShareModal`, `FinalPreviewModal`
  (guest Login button), `builder/page.jsx`, `layout.js`, `store.js`.
- Backend: honeypot field renamed `website` -> `hpField`.

## Checked
jsdom UI tests (7 scenarios): guest path, closing benefits with X, logged-in path with validation / send / thanks / redirect, error + retry,
guest name + honeypot, Login remembers the pending review, review shows once after login, stale pending ignored. The earlier suites (share, AI, ATS)
still pass after the Modal change. Lint clean, `next build` passes, 38 backend tests.
NOT checked: the whole thing against a live backend, MongoDB and real login/e-mail codes.
**Note:** `/my-resume` and `/create-resume` are still the static designs: the redirect works, but the new resume only appears in the list after the next phase.

## Manual test
1. Logged out: build a resume, Generate, close the share dialog -> benefits dialog -> Maybe later -> review -> Skip -> `/create-resume`.
2. Same again, press Login -> log in -> the review opens once (on `/`) -> Skip -> `/my-resume`. Reload: no review again.
3. Logged in: Generate, close share -> review straight away -> Send -> "Thank you!" -> `/my-resume`.
4. Admin (Postman): `GET /api/admin/reviews` shows the review as `pending`.
