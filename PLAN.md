# Deck Builder — Plan & Stubs

React + Next.js + shadcn/ui. **All logic is stubs** — no real auth, no real DB, no real card API. Implement everything yourself.

---

## Quick start (no bash)

- Run **`npm start`** (or double-click **`Start.bat`** / **`Start.ps1`**).
- Open `http://localhost:3000` → `/login` → stub button goes to `/home`.

---

## Stub locations (implement here)

| Where | What to implement |
|-------|-------------------|
| **lib/supabase.ts** | `createClient` when env vars exist; `hasSupabaseConfig()` |
| **lib/auth.ts** | `getCurrentUser`, `signInWithGoogle`, `signOut`, `ensureOwnedCardsDeck` |
| **lib/deck-manager.ts** | `getUserDecks`, `createDeck`, `getDeckCards`, `addCardToMainDeck`, `addCardToExtraDeck`, `deleteCardFromDeck`, `deleteDeck`, `updateDeckName`, `getAllDecks` |
| **app/api/cards/route.ts** | GET list: e.g. YGOPRODeck `cardinfo.php` with name, type, limit, offset |
| **app/api/cards/[cardId]/route.ts** | GET one card by ID |
| **app/page.tsx** | Session check; redirect to /home if logged in, else /login |
| **app/login/page.tsx** | Call `signInWithGoogle()`, handle redirect |
| **app/home/page.tsx** | Auth check, `getUserDecks()`, New Deck (`createDeck`), Sign Out (`signOut`), link to /deck/[id], delete deck |
| **app/deck/[id]/page.tsx** | Load deck name + cards, card search (GET /api/cards), add/remove cards, updateDeckName, owned ★ |
| **app/owned-cards/page.tsx** | Find “Owned Cards” deck, `getDeckCards`, list cards |

---

## Todo checklist

### Auth & Supabase

- [ ] Add `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Implement `lib/supabase.ts` (createClient, hasSupabaseConfig)
- [ ] Implement `lib/auth.ts` (getCurrentUser, signInWithGoogle, signOut, ensureOwnedCardsDeck)
- [ ] Login page: wire signInWithGoogle and redirect
- [ ] Protected routes: redirect to /login when not authenticated (/home, /deck/[id], /owned-cards)
- [ ] After login: call ensureOwnedCardsDeck (e.g. on home load)

### Home (decks list)

- [ ] Load decks: getUserDecks() in app/home/page.tsx
- [ ] New Deck: prompt name, createDeck()
- [ ] Delete deck: deleteDeck(deckId), keep “Owned Cards” undeletable
- [ ] Sign out: signOut() then redirect to /login

### Deck editor (/deck/[id])

- [ ] Deck name: load from Supabase, editable, updateDeckName()
- [ ] Load cards: getDeckCards(deckId), render main/extra
- [ ] Card search: GET /api/cards?name=&type=, show results, add to main/extra (addCardToMainDeck / addCardToExtraDeck)
- [ ] Remove card: deleteCardFromDeck(deckId, cardId, location)
- [ ] Owned ★: get “Owned Cards” deck cards, show ★ on owned cards
- [ ] Limits: main 60, extra 15, max 3 per card

### Owned cards (/owned-cards)

- [ ] Resolve “Owned Cards” deck (getUserDecks → by name)
- [ ] List cards: getDeckCards(ownedDeckId)

### API & data

- [ ] **app/api/cards/route.ts** — Implement: fetch YGOPRODeck or backend, return card list
- [ ] **app/api/cards/[cardId]/route.ts** — Implement: fetch card by ID
- [ ] Supabase schema: tables `decks`, `deck_cards`, RLS for per-user access

### Cleanup

- [ ] Delete empty **FrontEnd** folder if it still exists
- [ ] Run `npm run lint` and fix any issues

---

## Files removed (no longer in project)

- `server.js` — No Node server; Next.js only
- `BackEnd/main.py`, `requirements.txt` — Removed; implement cards in Next.js API routes or your own backend
- Old `FrontEnd/*.html` and `FrontEnd/js/*` — Replaced by Next.js app and lib stubs
- Old batch/ps1 scripts — Replaced by `Start.bat`, `Start.ps1`, `npm start`
