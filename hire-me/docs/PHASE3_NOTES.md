# Phase 3 - builder state, live preview, validation, auto-fill

Copy the files of this zip into `hire-me/frontend/` (same paths; `layout.js` already contains the Phase 2 changes).
Needs the Phase 1 backend running (guests are saved by it). `src/lib/returnTo.js` replaces the one from Phase 1's `frontend-fixes`.

## What works now
- **Every section is a real form** (personal info, summary, jobs, education, projects, skills, languages, references): add, edit,
  delete (asks first when the entry has text), move up/down, "currently working / studying" (disables the end date), date order check.
- **One source of truth:** the Redux `builder` draft. The forms write to it, the live preview reads it, and the same shape is what the
  API stores in `Resume` and `User.profile`.
- **Live preview** (Preview <-> ATS Score button): the chosen template + colour, real A4 pages, updates as you type.
- **Template / Color / Reset** buttons work (dialogs). Template list = catalog from the API, limited to designs that exist in `src/resume/templates`.
- **Validation** (`src/resume/validation.js`, same limits as the API): errors show after you leave a field; "Next" is blocked on a step with
  a mistake, shows all its messages and focuses the first wrong field. Generate (last step) jumps to the first step with a mistake.
- **Autosave**: ~0.8 s after you stop typing. Guests are saved too (anonymous cookie). Nothing is created by just opening the builder:
  the first save waits until there is content. Refreshing never loses data (browser copy + server copy). Status line: Saving / Saved / Retry.
- **Auto-fill**: a new resume starts from the profile (logged in) or from the guest's last information (browser). All fields stay editable.
- **Guest -> login**: the server claims the guest's resumes at login; the builder then keeps editing the same resume. The guest's latest browser
  data is also handed to the profile (never overwriting filled fields) and then forgotten.
- **Builder entry URLs:** `/builder` continue the draft - `/builder?template=<slug>` new resume with that template ("Use This") -
  `/builder?new=1` blank new resume - `/builder?resume=<id>` edit a saved resume (works for guests and users).

## Fixed on the way
- `ImageUpload.jsx` crashed as soon as a photo was shown (it used `e` outside a handler, and `next/image` refuses Cloudinary / blob URLs).
- `Tabs.jsx` had the "Add" / "Remove" screen-reader labels swapped.

## Not in this phase (next ones)
- "Improve with AI" buttons are shown **disabled** (`components/builder/AiEnhanceButton.jsx` is the one file the AI phase changes).
- The ATS panel is still the static design. Generate / Download / share dialog come with the generate phase.
- Guests cannot upload a photo yet (needs login); a notice says so.

## Checked
Lint clean, `next build` passes, all 8 forms server-render against a seeded store (values, errors, buttons), 9 validation tests pass,
and the draft logic (dirty tracking, reorder, detach/adopt, prefill, guest memory) was exercised with a script.
Not checked: typing in a real browser, and saving against a live backend + MongoDB.

## Manual test
1. Open `/builder` logged out: type a name + email -> "Saved" appears; refresh -> still there; DevTools > Cookies shows `rb.gid`.
2. Type `ada@` in email, press Next -> red message, focus on the field, no step change.
3. Add 2 jobs, move one down, reload: same order. Tick "Currently working": end date is disabled.
4. Template / Color dialogs change the preview at once; Reset starts blank (the old resume stays saved).
5. Log in: you keep working on the same resume (no duplicate); the profile page shows your data.
6. `/templates` -> "Use This" opens a blank builder with that template; do it twice -> two resumes, same template.
