/**
 * Auth stubs — implement with Supabase when DB is rebuilt.
 */

export async function getCurrentUser() {
  // Implement: get session/user from Supabase auth
  return null;
}

export async function signInWithGoogle() {
  // Implement: supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ... } })
  return { success: false as const, error: new Error('Not implemented') };
}

export async function signOut() {
  // Implement: supabase.auth.signOut()
  return { success: true as const };
}

export async function ensureOwnedCardsDeck() {
  // Implement: ensure current user has an "Owned Cards" deck (create if missing)
}
