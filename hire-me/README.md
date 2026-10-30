# HireMe - resume builder (backend + frontend)

```
backend/    Express 5 + MongoDB API        (see backend/README.md for every endpoint)
frontend/   Next.js (App Router) + Redux   (see frontend/.env.local.example)
docs/       one note per build phase, and FINAL_CHECKLIST.md (manual test list, what was added, what was not verified)
```

## Run
1. `cd backend && npm install && cp .env.example .env` - fill in MongoDB, the secrets, `ADMIN_EMAILS`, `GEMINI_API_KEY` - then `npm run seed` and `npm run dev`.
2. `cd frontend && npm install && cp .env.local.example .env.local` then `npm run dev`.

## Tests
- `cd backend && npm test` (44)
- `cd frontend && node --test src/lib/*.test.js src/resume/*.test.js src/resume/ats/*.test.js` (38)

Note: `frontend/assets/Icons` was renamed to `frontend/assets/icons` (the code imports `./icons/...`; the old name broke Linux / Vercel builds).
