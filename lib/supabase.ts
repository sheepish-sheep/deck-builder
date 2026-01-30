import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function hasSupabaseConfig(): boolean {
  return Boolean(url && anonKey);
}

export const supabase: SupabaseClient =
  url && anonKey ? createClient(url, anonKey, {
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
      }) : (null as unknown as SupabaseClient);
