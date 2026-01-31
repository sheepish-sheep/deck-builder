import { hasSupabaseConfig, supabase } from './supabase';
import { createDeck, getUserDecks } from './deck-manager';

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

export async function ensureOwnedCardsDeck() {
  if (hasSupabaseConfig()) {
    const result = await getUserDecks();
    if (!result.success) return;
    const decks = result.decks ?? [];
    const hasOwnedCards = decks.some((d) => d.name === 'Owned Cards');
    if (!hasOwnedCards) {
      const createResult = await createDeck('Owned Cards', '');
      if (!createResult.success) return;
    }
  }
}
