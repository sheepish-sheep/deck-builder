/**
 * Supabase client stub. Do this step last (with other Supabase work).
 *
 * Implement:
 * 1. Create the client when env vars are present:
 *    createClient(
 *      process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *      { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } }
 *    )
 * 2. Export that client as `supabase`.
 * 3. hasSupabaseConfig(): return true only when both NEXT_PUBLIC_SUPABASE_URL and
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY are defined and non-empty (so the rest of the app
 *    can skip Supabase calls when not configured).
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export const supabase: SupabaseClient = null as unknown as SupabaseClient;

export function hasSupabaseConfig(): boolean {
  return false;
}
