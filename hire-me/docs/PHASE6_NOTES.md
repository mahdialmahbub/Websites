# Phase 6 - Generate, share, public page, PDF

Copy `backend/` and `frontend/` files over the project (same paths). No new packages.
`assets/Icons/` got two new files (WhatsApp and Telegram in the violet of the other share icons).

## Flow
1. Last step -> **Generate**. First the same checks as "Next" (a step with a mistake is shown). Then: the draft is saved right now
   (guests too), the server validates it again, finalizes it, and returns the **share link** (`/r/<unguessable id>`).
2. The **share dialog** opens (the "Your resume is ready" design, now real): live first page, **Download PDF**, link with **Copy**,
   **Facebook, LinkedIn, X, WhatsApp, Telegram, Email**, and **More...** (the phone's own share sheet, shown only where the browser has it).
   Guests see **Login**, users see **My resumes**.
3. The owner can **turn sharing off / on** (the link stays the same) and choose whether email and phone show on the shared page (hidden by default).
4. Double click on Generate: ignored while it runs, and the server returns the same resume and link anyway - never a second resume.
5. Failure (offline, validation) shows a message next to the button; nothing is lost.

## Public page `/r/<id>`
Server-rendered (crawlers see the Open Graph / Twitter tags), `noindex, nofollow`, never cached, 404 for unknown or switched-off links.
All text goes through React (escaped); links in templates are http(s) only. Visitors get the same template, colour and pages, and a Download PDF button.

## PDF
"Download PDF" prints the very same pages as the preview as A4 (`Save as PDF` in the browser's print window). Selectable text (ATS friendly), every
script works, preview = PDF = shared page.
The header **Download** buttons now work too.

## Checked
jsdom UI tests: share dialog (6 links built correctly, copy, download, contact toggle, turn off / on, Web Share button, Login vs My resumes),
`useGenerate` (double click -> one save + one generate, server validation message, save failure stops generate). Public page against a mock
backend: noindex, canonical, Open Graph, `<script>` in a name is escaped, 404s, no-store. Lint clean, `next build` passes, 35 frontend + 38 backend tests.
NOT checked: real browser print dialog, real social sites, live MongoDB.

## Manual test
1. Fill name + email + something, go to the last step, press Generate -> dialog. Open the link in a private window -> the resume.
2. "Turn off sharing" -> reload the private window -> not found. "Turn on sharing" -> the same link works again.
3. Tick "Show my email and phone..." -> the shared page shows them; untick -> gone.
4. Paste the link into Facebook's sharing debugger / LinkedIn Post Inspector (needs a public URL) to see the preview card.
5. Download PDF -> print window -> Save as PDF, A4, margins none.
