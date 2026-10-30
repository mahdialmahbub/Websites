# Phase 4 - AI "Improve with AI"

Copy `backend/` and `frontend/` files over the project (same paths). Then in `backend`: `npm install` (adds `@google/genai`),
put `GEMINI_API_KEY=...` in `.env` (key from https://aistudio.google.com/apikey) and restart.

## How it behaves
- A button under every description field: professional summary, job description, education description,
  project responsibilities, project description.
- Text in the field -> improved. Empty field -> written from what is already filled in (job title, company, skills, degree, project name ...).
  Not enough information -> a clear message ("Add the job title first, then try again."), nothing is sent to the AI.
- The result REPLACES the text. **Undo** puts the old text back in one click (it disappears once you edit the result).
- The button is disabled while the AI works. A failure shows a message and "Try again". If you keep typing while the AI works,
  your text is never overwritten.
- The AI is called from the server only. Per-visitor and per-IP limits apply (see README).
- Output rules: concise, action verbs, no first-person words, no invented facts: the server rejects an answer that contains numbers
  that are not in your text / form data, or "I / my / we / our", and retries once.

## Checked
Backend: 27 unit tests (prompt, cleaning, quality gate, retry, error paths) + the real Gemini SDK against a local fake Gemini server
(request shape, no-thinking setting, parsing, 429 / 500 / timeout mapping), route smoke test (validation, 503 without key, guest limit).
Frontend: 5 UI scenarios in jsdom against a mocked API (generate + Undo, improve, loading/disabled, error + retry, typing during request),
lint clean, `next build` passes.
NOT checked: a call to the real Gemini service (no key here). The model name `gemini-2.5-flash` is the default; change `GEMINI_MODEL` if
your key uses another one.

## Manual test
1. With the key set: type a job title + company, leave the description empty -> "Write with AI" -> text appears -> Undo.
2. Type a rough sentence ("did design stuff for web") -> "Improve with AI".
3. Clear the job title and press it on an empty description -> the "Add the job title first" message.
4. Stop the backend key (remove it) -> "AI help is not available right now".
