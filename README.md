# Deck Builder

Yu-Gi-Oh! deck builder — **React + Next.js** with **shadcn/ui**. Everything is **stubs only**; no real logic — implement auth, decks, and card API yourself.

## Folder structure

- `app/` — Next.js App Router (pages, layout, **stub** API routes)
- `lib/` — **Stub** Supabase client, auth, deck-manager (no implementation)
- `components/ui/` — shadcn Button, Card, Input, Label, Select
- `data/`, `tests/` — Empty placeholders
- **Removed:** `BackEnd/`, `requirements.txt`, old `FrontEnd/` (empty folder can be deleted manually)

## Setup — one command (no bash)

- **Double-click** `Start.bat` (or run `Start.ps1`), **or** run **`npm start`** in the project folder.

That runs `npm install` then starts the dev server. Open [http://localhost:3000](http://localhost:3000) → redirects to `/login` → stub login button goes to `/home`.

### Supabase (when you rebuild DB)

Add `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then implement `lib/supabase.ts` (createClient) and all functions in `lib/auth.ts` and `lib/deck-manager.ts`.

## Scripts

- **`npm start`** — Install deps + start dev server
- `npm run dev` — Dev server only
- `npm run build` — Production build
- `npm run serve` — Run production build
- `npm run lint` — Lint

## UI (shadcn/ui)

- **Button**, **Card**, **Input**, **Label**, **Select** in `components/ui/`. Import from `@/components/ui`.
- Theme: CSS variables in `app/globals.css` (dark slate).

## What’s implemented vs stubs

- **Layout and pages** — UI only; comments in each file say what to implement.
- **lib/supabase.ts** — `supabase` is a stub; `hasSupabaseConfig()` returns false. Implement when you have env vars.
- **lib/auth.ts** — All functions return stub values (null, not implemented). Implement with Supabase auth.
- **lib/deck-manager.ts** — All functions return empty/stub results. Implement with Supabase tables (decks, deck_cards).
- **app/api/cards/** — Return empty array / 404. Implement by calling YGOPRODeck or your own backend.

See **PLAN.md** for the full todo list.
