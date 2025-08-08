// supabase-config.js

// Supabase connection information
const SUPABASE_URL = 'https://fcecjjqgspfxibpizwqu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZWNqanFnc3BmeGlicGl6d3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTM4NTksImV4cCI6MjA2MjEyOTg1OX0.ISBxrh5GSVOeA4bXPia7qLugUIxLovTYchWfHUw1das';

// Additional options to improve stability
const SUPABASE_OPTIONS = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Info': 'yu-gi-oh-deck-builder'
    },
  },
  realtime: {
    timeout: 20000 // Increase timeout to 20 seconds
  }
};

export { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_OPTIONS };
