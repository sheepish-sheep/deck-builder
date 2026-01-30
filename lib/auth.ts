/**
 * Auth: mock (localStorage) when Supabase not configured; real Supabase when configured.
 * Same API for both — pages always call getCurrentUser(), signInWithGoogle(), etc.
 */
import { hasSupabaseConfig, supabase } from './supabase';

const MOCK_USER_KEY = 'deck-builder-mock-user';

function getMockUser(): { id: string; email: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { id: string; email: string };
  } catch {
    return null;
  }
}

function setMockUser(user: { id: string; email: string } | null) {
  if (typeof window === 'undefined') return;
  if (user) localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(MOCK_USER_KEY);
}

export async function getCurrentUser() {
  if (hasSupabaseConfig()) {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  return getMockUser();
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
  setMockUser({ id: 'mock-user-id', email: 'mock@local.dev' });
  return { success: true as const, data: { url: null } };
}

export async function signOut() {
  if (hasSupabaseConfig()) {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false as const, error };
    return { success: true as const };
  }
  setMockUser(null);
  return { success: true as const };
}

export async function ensureOwnedCardsDeck() {
  if (hasSupabaseConfig()) {
    // Implement: getUserDecks(), if no "Owned Cards" then createDeck("Owned Cards", ...)
    return;
  }
  // Mock: deck-manager will ensure Owned Cards in localStorage when you implement mock createDeck
  return;
}
