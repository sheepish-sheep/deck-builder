import { hasSupabaseConfig, supabase } from './supabase';
import { createDeck, deleteDeck, getUserDecks } from './deck-manager';

export async function getCurrentUser() {
  if (hasSupabaseConfig()) {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  return null;
}

export async function signInWithGoogle() {
  if (hasSupabaseConfig()) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/home` : '/home',
      },
    });
    if (error) return { success: false as const, error };
    return { success: true as const, data };
  }
  return { success: false as const, error: { message: 'Supabase not configured' } };
}

export async function signOut() {
  if (hasSupabaseConfig()) {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false as const, error };
    return { success: true as const };
  }
  return { success: true as const };
}

let ensureOwnedCardsPromise: Promise<void> | null = null;

export async function ensureOwnedCardsDeck() {
  if (!hasSupabaseConfig()) return;
  if (!ensureOwnedCardsPromise) {
    ensureOwnedCardsPromise = (async () => {
      const result = await getUserDecks();
      if (!result.success) return;
      const decks = result.decks ?? [];
      const ownedDecks = decks.filter((d) => d.name === 'Owned Cards');
      if (ownedDecks.length === 0) {
        const createResult = await createDeck('Owned Cards', '');
        if (!createResult.success) return;
      }
      const after = await getUserDecks();
      if (!after.success) return;
      const ownedAfter = (after.decks ?? []).filter((d) => d.name === 'Owned Cards');
      if (ownedAfter.length > 1) {
        const toKeep = ownedAfter[0];
        const keepId = toKeep.id ?? (toKeep as { deck_id?: string }).deck_id;
        for (let i = 1; i < ownedAfter.length; i++) {
          const dup = ownedAfter[i];
          const dupId = dup.id ?? (dup as { deck_id?: string }).deck_id;
          if (dupId) await deleteDeck(dupId);
        }
      }
    })();
  }
  await ensureOwnedCardsPromise;
  ensureOwnedCardsPromise = null;
}
