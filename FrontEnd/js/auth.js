// auth.js
// Import Supabase config with improved options
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_OPTIONS } from './supabase-config.js';
import { getUserDecks, createDeck } from './deck-manager.js';

// Initialize the Supabase client with better options for stability
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_OPTIONS);

async function ensureOwnedCardsDeck() {
  const result = await getUserDecks();
  if (!result.success) return; // handle error as needed

  const ownedDeck = result.decks.find(deck => deck.name === "Owned Cards");
  if (!ownedDeck) {
      // Create the special deck
      await createDeck("Owned Cards", "This deck contains all your owned cards.");
      // Optionally reload decks or update UI
  }
}

// Sign in with Google
async function signInWithGoogle() {
    console.log('signInWithGoogle function called');
    console.log('Supabase URL:', SUPABASE_URL);
    console.log('Origin URL:', window.location.origin);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/Homepage.HTML'
          }
        });
        
        console.log('Auth response:', data);
        
        if (error) {
          console.error('Error signing in with Google:', error);
          alert('Error signing in with Google: ' + error.message);
          return { success: false, error };
        }

        
        return { success: true, data };
    } catch (err) {
      console.error('Exception in signInWithGoogle:', err);
      alert('Error signing in: ' + err.message);
      return { success: false, error: err };
    }
}

// Sign out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      return { success: false, error };
    }
    
    return { success: true };
  }
  
  // Get current user
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  
  // Check if user is authenticated
  async function isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }
  
  export { supabase, signInWithGoogle, signOut, getCurrentUser, isAuthenticated, ensureOwnedCardsDeck };