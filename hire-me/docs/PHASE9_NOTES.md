# Phase 9 - /my-resume + create + edit flow

Copy the `frontend/` files over the project (same paths). No backend change, no new packages.

## /my-resume
- **Protected**: guests go to `/login?next=/my-resume`.
- **All resumes, paginated** (12 per page, `?page=2` in the address so Back works): a live preview of the first page (drawn when the card scrolls
  into view), title, template name, last updated, **ATS score**, Draft / Generated, Shared.
- **Edit** opens `/builder?resume=<id>` fully filled in. Saving **updates the same resume** (autosave PATCH with the revision) and the share link is untouched.
- **Delete** asks first (the dialog names the resume and warns that a share link stops working). If that resume is the one open in the builder,
  the builder draft is reset, otherwise it would be saved again as a new resume.
- **Duplicate** (a private copy, no share link), **Copy share link** (a resume that is not shared yet gets its link first), **Download PDF**
  (the same pages as the preview), **View Preview** (the whole resume, every page).
- Empty state with a Create button; an emptied last page goes back to the previous page; errors show a message with "Try again".
- Below the list: templates to start a new resume from.

## /create-resume
Title + template (catalog, only designs the frontend has), then the builder opens with both: `/builder?template=<slug>&title=<text>`.
Nothing is saved until there is content. Open to guests (this is where a guest lands after Generate). Cancel -> `/my-resume` (users) or `/` (guests).

## Checked
jsdom (10 scenarios): list with all details, Edit, delete (cancel, error keeps it, success resets the open draft), duplicate + refresh, copy link
(existing / share-then-copy), download + preview, empty state, pagination, emptied page, guests redirected, create page, builder entry with
template + title, and the edit flow with the real autosave (PATCH the same resume, no POST, no share call).
All earlier UI suites still pass. Lint clean, `next build` passes.
NOT checked: against a live backend / MongoDB, the browser's print dialog.
