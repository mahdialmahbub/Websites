# Phase 8 - guest claim + profile page

Copy `backend/` and `frontend/` files over the project (same paths). No new packages.

## Guest claim (hardened)
The claim itself came with Phase 1 (the server does it at every login; `POST /resumes/claim` repeats it; the browser's last data is handed over
and forgotten). This phase fixes the order and tests the edge cases:
- **Profile first, then move.** If the profile cannot be saved, no resume has moved, so the next try finds everything. (Before, a failure in
  between left resumes moved but the profile not topped up.)
- It moves exactly the resumes it just read, never another guest's.
- **Idempotent**: claiming again does nothing. **No / expired guest cookie**: nothing to claim, the browser draft still tops up the profile.
- Newest data fills the gaps first, and **nothing already on the profile is overwritten** (the browser draft counts as the newest).
- 6 unit tests (in-memory fakes) cover all of these.

## Profile page `/profile`
Shows the real saved profile instead of sample data: contact details (links only when they are safe http(s)), summary, jobs, education, projects,
skills, languages, references. Empty sections show an "Add ..." button that opens that tab in the editor (`/profile/edit?tab=experience`).
"Edit information" opens the editor. A line reminds that profile changes only affect NEW resumes. The profile photo is shown when there is one.

## Profile editor `/profile/edit`
- The same 8 sections and the same forms as the builder (so the same validation, add / move / delete, date checks, AI buttons), but a **separate
  draft**: editing the profile never touches the resume you are building, and nothing is saved until you press **Save changes**.
- Save checks everything like the builder does; a mistake opens its tab and shows its messages. Then all 8 sections are saved to `User.profile`
  and you return to `/profile` with a "profile saved" note. Cancel asks first when there are changes. Closing the tab with unsaved changes warns.
- Not logged in -> `/login?next=/profile/edit`.
- **Saved resumes never change**: the profile is only read when a NEW resume starts (auto-fill).

## How the forms became reusable
`formTarget.js` tells a form which draft it edits ("builder" or "profile"); `useSection` hands out the matching actions. The builder page is
unchanged (default target). New: `store/profile/profileDraftSlice.js` (it reuses the builder's editing reducers).

## Fixed on the way
The old `/profile/edit` imported the builder forms, which since Phase 3 write to the builder draft: it would have edited (and autosaved) the resume
being built. It now uses its own draft.

## Checked
jsdom (7 scenarios): profile page with real data, unsafe `javascript:` link blocked, empty states, saved note; editor loads, edits, saves all
8 sections, resume draft untouched, `?tab=` opens a tab, validation blocks save and opens the tab, cancel confirm, server error, logged out.
All earlier UI suites (share, AI, ATS, review flow) still pass; 44 backend tests; lint clean; `next build` passes.
NOT checked: against a live backend / MongoDB.
Not part of this phase: the "Log out" and "Delete account" items of the profile menu are still not wired (they were not before either).

## Manual test
1. Log in, `/profile`: your saved data. "Add work experience" opens the editor on that tab.
2. Edit a job title and the summary, Save changes -> back on the profile with the new values and the note.
3. Make a new resume: it starts with the new profile data. Open an older resume: it still has its old text.
4. Clear your name in the editor, Save: blocked, the Personal Information tab opens with the message.
5. Guest: build a resume, Generate, Login: the resume is in your account and your profile got the details (only where it was empty).
