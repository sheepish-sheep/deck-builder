/**
 * Supabase client stub.
 * Implement: create client with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local
 */
import type { SupabaseClient } from '@supabase/supabase-js';

// Stub: replace with real createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, ...)
export const supabase: SupabaseClient = null as unknown as SupabaseClient;

export function hasSupabaseConfig(): boolean {
  // Implement: return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return false;
}
