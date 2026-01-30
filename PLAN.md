# Deck Builder — Plan & Stubs

React + Next.js + shadcn/ui. **Do Supabase when it’s back** — auth, decks, and pages all depend on it.

---

## Current status

- **Done:** Card API — `app/api/cards/route.ts` and `app/api/cards/[cardId]/route.ts` call YGOPRODeck and return card list / single card.
- **Stubbed:** `lib/supabase.ts` (null until env), `lib/auth.ts` (mock + real branches), `lib/deck-manager.ts` (stubs only). Root redirect uses `app/RootRedirect.tsx` + `getCurrentUser()`.
- **Waiting on Supabase:** Login (Google), home decks, deck editor, owned cards. Plan: wait until Supabase is updated, then wire env → supabase client → auth → deck-manager → pages in one pass.

---

## Quick start (no bash)

- Run **`npm start`** (or double-click **`Start.bat`** / **`Start.ps1`**).
- Open `http://localhost:3000` → `/login` → stub button goes to `/home`.

---

## When Supabase is back — do in this order

### 1. Supabase config & schema

- [ ] Add **`.env.local`** with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] **lib/supabase.ts** — `createClient(url, anonKey, { auth: { autoRefreshToken, persistSession, detectSessionInUrl } })` and export it; `hasSupabaseConfig()` returns true when both env vars are set.
- [ ] In Supabase dashboard: create **decks** (deck_id, user_id, name, description, created_at) and **deck_cards** (id, deck_id, card_id, location, quantity); enable RLS so users only see/edit their own data.

### 2. Auth (lib/auth.ts)

- [ ] **getCurrentUser** — `supabase.auth.getUser()`, return user or null.
- [ ] **signInWithGoogle** — `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: origin + '/home' } })`; return `{ success, data }` or `{ success: false, error }`.
- [ ] **signOut** — `supabase.auth.signOut()`; return `{ success }` or `{ success: false, error }`.
- [ ] **ensureOwnedCardsDeck** — fetch user decks; if no deck named “Owned Cards”, call createDeck("Owned Cards", …). Call this after login (e.g. when /home loads).

### 3. Deck manager (lib/deck-manager.ts)

- [ ] **getUserDecks** — `supabase.from('decks').select('*')` (RLS filters by user); return `{ success, decks }` or `{ success: false, error }`.
- [ ] **createDeck** — get user, insert into decks; return `{ success, deck }` or `{ success: false, error }`.
- [ ] **getDeckCards** — `supabase.from('deck_cards').select('*').eq('deck_id', deckId)`; return `{ success, cards }` or `{ success: false, error }`.
- [ ] **addCardToMainDeck** / **addCardToExtraDeck** — validate limits (60 main, 15 extra, 3 per card), insert row; return `{ success, data }` or `{ success: false, error }`.
- [ ] **deleteCardFromDeck** — delete one row matching deck_id, card_id, (and location if provided); return `{ success }` or `{ success: false, error }`.
- [ ] **deleteDeck** — delete deck_cards then deck; block deleting “Owned Cards”; return `{ success }` or `{ success: false, error }`.
- [ ] **updateDeckName** — update decks.name by deck_id; return `{ success, deck }` or `{ success: false, error }`.
- [ ] **getAllDecks** — same as getUserDecks.

### 4. Pages (wire to auth + deck-manager)

- [ ] **app/page.tsx** — Already uses `RootRedirect`; `getCurrentUser()` will work once auth is implemented (redirect to /home if user, else /login).
- [ ] **app/login/page.tsx** — On “Sign in” click call `signInWithGoogle()`; on success OAuth redirects; on error show message.
- [ ] **app/home/page.tsx** — On load `getCurrentUser()`, if null redirect to /login; `getUserDecks()` and set state; “New Deck” → prompt name, `createDeck(name)`, refetch; “Sign Out” → `signOut()`, redirect to /login; delete deck → `deleteDeck(deckId)` (skip “Owned Cards”), refetch; link each deck to `/deck/[id]`.
- [ ] **app/deck/[id]/page.tsx** — Load deck name + cards with `getDeckCards(deckId)`; card search via GET /api/cards; add/remove with addCardToMainDeck, addCardToExtraDeck, deleteCardFromDeck; editable deck name → `updateDeckName`; show ★ on cards in “Owned Cards” deck; enforce 60 main, 15 extra, 3 per card.
- [ ] **app/owned-cards/page.tsx** — `getUserDecks()`, find “Owned Cards” deck, `getDeckCards(ownedDeckId)`, render list (optional add/remove).
- [ ] **Protected routes** — /home, /deck/[id], /owned-cards: redirect to /login when `getCurrentUser()` is null (per page or shared layout/middleware).

### 5. Polish & cleanup

- [ ] Delete empty **FrontEnd** folder if it exists.
- [ ] Run **`npm run lint`** and fix any issues.

---

## Reference — already done

- **Card API:** `GET /api/cards` (query: name, type, limit, offset) and `GET /api/cards/[cardId]` proxy YGOPRODeck and return list / single card (or 404).

---

## Files removed (no longer in project)

- `server.js` — No Node server; Next.js only.
- `BackEnd/main.py`, `requirements.txt` — Removed.
- Old `FrontEnd/*.html` and `FrontEnd/js/*` — Replaced by Next.js app and lib stubs.
- Old batch/ps1 scripts — Replaced by `Start.bat`, `Start.ps1`, `npm start`.
