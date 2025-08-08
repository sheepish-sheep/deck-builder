// deck-manager.js
import { supabase } from './auth.js';

async function createDeck(deckName, deckDescription = '') {
  if (!deckName || deckName.trim() === '') {
      return { success: false, error: { message: 'Deck name cannot be empty' } };
  }

  try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
          throw new Error('User not authenticated');
      }
      
      // Create a default description if none provided
      const description = deckDescription || `${deckName} - created on ${new Date().toLocaleDateString()}`;
      
      const { data, error } = await supabase
          .from('decks')
          .insert([
              {
                  name: deckName,
                  user_id: user.id,
                  description: description
              }
          ])
          .select(); 

      if (error) {
          console.error('Database error creating deck:', error);
          return { success: false, error };
      }

      return { success: true, deck: data[0] };
  } catch (err) {
      console.error('Exception creating deck:', err);
      return { success: false, error: err };
  }
}

async function getUserDecks() {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*');
    
    if (error) {
      console.error('Error fetching decks:', error);
      return { success: false, error };
    }
    
    const decks = data || [];
    return { success: true, decks };
  } catch (err) {
    console.error('Exception fetching decks:', err);
    return { success: true, decks: [] };
  }
}

// Add card to deck
async function addCardToMainDeck(deckId, cardId, quantity = 1) {
    try {
        // First, get current deck composition from database
        const { data: currentCards, error: fetchError } = await supabase
            .from('deck_cards')
            .select('*')
            .eq('deck_id', deckId);
            
        if (fetchError) {
            console.error('Error fetching current deck cards:', fetchError);
            return { success: false, error: fetchError };
        }
        
        // Count current main deck cards
        const mainDeckCards = currentCards.filter(card => card.location === 'main');
        const currentMainDeckCount = mainDeckCards.reduce((total, card) => total + card.quantity, 0);
        
        // Count current copies of this specific card in main deck
        const currentCardCopies = mainDeckCards
            .filter(card => card.card_id === cardId)
            .reduce((total, card) => total + card.quantity, 0);
        
        // Validate main deck size (max 60 cards)
        if (currentMainDeckCount + quantity > 60) {
            return { success: false };
        }
        
        // Validate card copy limit (max 3 of same card)
        if (currentCardCopies + quantity > 3) {
            return { success: false };
        }
        
        // If validation passes, proceed with insert
        const { data, error } = await supabase
            .from('deck_cards')
            .insert([{ deck_id: deckId, card_id: cardId, location: "main", quantity }])
            .select();
            
        if (error) {
            console.error('Error adding card to main deck:', error);
            return { success: false, error };
        }
        
        return { success: true, data: data[0] };
        
    } catch (err) {
        console.error('Exception in addCardToMainDeck:', err);
        return { success: false, error: err };
    }
}

// Add card to deck
async function addCardToOwnedDeck(deckId, cardId, quantity = 1) {
    try {
        // First, get current deck composition from database
        const { data: currentCards, error: fetchError } = await supabase
            .from('deck_cards')
            .select('*')
            .eq('deck_id', deckId);
            
        if (fetchError) {
            console.error('Error fetching current deck cards:', fetchError);
            return { success: false, error: fetchError };
        }
        
        // Count current main deck cards
        const mainDeckCards = currentCards.filter(card => card.location === 'main');
        const currentMainDeckCount = mainDeckCards.reduce((total, card) => total + card.quantity, 0);
        
        // Count current copies of this specific card in main deck
        const currentCardCopies = mainDeckCards
            .filter(card => card.card_id === cardId)
            .reduce((total, card) => total + card.quantity, 0);
            
        // Validate card copy limit (max 3 of same card)
        if (currentCardCopies + quantity > 3) {
            return { success: false };
        }

        // If validation passes, proceed with insert
        const { data, error } = await supabase
            .from('deck_cards')
            .insert([{ deck_id: deckId, card_id: cardId, location: "main", quantity }])
            .select();
            
        if (error) {
            console.error('Error adding card to main deck:', error);
            return { success: false, error };
        }
        
        return { success: true, data: data[0] };
        
    } catch (err) {
        console.error('Exception in addCardToMainDeck:', err);
        return { success: false, error: err };
    }
}

// Add card to deck
async function addCardToExtraDeck(deckId, cardId, quantity = 1) {
    try {
        // First, get current deck composition from database
        const { data: currentCards, error: fetchError } = await supabase
            .from('deck_cards')
            .select('*')
            .eq('deck_id', deckId);
            
        if (fetchError) {
            console.error('Error fetching current deck cards:', fetchError);
            return { success: false, error: fetchError };
        }
        
        // Count current extra deck cards
        const extraDeckCards = currentCards.filter(card => card.location === 'extra');
        const currentExtraDeckCount = extraDeckCards.reduce((total, card) => total + card.quantity, 0);
        
        // Count current copies of this specific card in extra deck
        const currentCardCopies = extraDeckCards
            .filter(card => card.card_id === cardId)
            .reduce((total, card) => total + card.quantity, 0);
        
        // Validate extra deck size (max 15 cards)
        if (currentExtraDeckCount + quantity > 15) {
            return { success: false };
        }
        
        // Validate card copy limit (max 3 of same card)
        if (currentCardCopies + quantity > 3) {
            return { success: false };
        }
        
        // If validation passes, proceed with insert
        const { data, error } = await supabase
            .from('deck_cards')
            .insert([{ deck_id: deckId, card_id: cardId, location: "extra", quantity }])
            .select();
            
        if (error) {
            console.error('Error adding card to extra deck:', error);
            return { success: false, error };
        }
        
        return { success: true, data: data[0] };
        
    } catch (err) {
        console.error('Exception in addCardToExtraDeck:', err);
        return { success: false, error: err };
    }
}

// Get cards in deck
async function getDeckCards(deckId) {
    if (!deckId || deckId === 'undefined') {
        console.error('Invalid deck ID passed to getDeckCards:', deckId);
        return { success: false, error: { message: 'Invalid deck ID' } };
    }
    
    try {
        const { data, error } = await supabase
            .from('deck_cards')
            .select('*')
            .eq('deck_id', deckId);
        
        if (error) {
            console.error('Error fetching deck cards:', error);
            return { success: false, error };
        }
        
        return { success: true, cards: data || [] };
    } catch (err) {
        console.error('Exception in getDeckCards:', err);
        return { success: false, error: err };
    }
}

// Delete deck
async function deleteDeck(deckId) {
    if (!deckId) {
        return { success: false, error: { message: 'Deck ID is required' } };
    }

    try {
        // First verify the deck exists and we can see it
        const { data: deckRecord, error: findError } = await supabase
            .from('decks')
            .select('*')
            .eq('deck_id', deckId)
            .single();
            
        if (findError || !deckRecord) {
            console.error('Deck not found:', findError);
            return { success: false, error: { message: 'Deck not found: ' + (findError?.message || 'Unknown error') } };
        }
        
        // Get current user for permission check
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error('User authentication failed:', userError);
            return { success: false, error: { message: 'User not authenticated' } };
        }
        
        // Verify ownership
        if (deckRecord.user_id !== user.id) {
            console.error('Ownership verification failed');
            return { success: false, error: { message: 'You can only delete your own decks' } };
        }
        
        // Delete all cards associated with this deck first
        const { data: deletedCards, error: cardsError } = await supabase
            .from('deck_cards')
            .delete()
            .eq('deck_id', deckId)
            .select();

        if (cardsError) {
            console.error('Error deleting deck cards:', cardsError);
            return { success: false, error: cardsError };
        }

        // Now delete the deck using deck_id
        const { data: deletedDeck, error: deckError } = await supabase
            .from('decks')
            .delete()
            .eq('deck_id', deckId)
            .select();

        if (deckError) {
            console.error('Error deleting deck:', deckError);
            return { success: false, error: deckError };
        }

        if (!deletedDeck || deletedDeck.length === 0) {
            console.error('No deck was actually deleted - likely RLS policy issue');
            return { success: false, error: { message: 'Deck deletion failed - likely RLS policy issue. Check Supabase RLS settings.' } };
        }

        return { success: true };
    } catch (err) {
        console.error('Exception deleting deck:', err);
        return { success: false, error: err };
    }
}

// Delete card from deck
async function deleteCardFromDeck(deckId, cardId, location = null) {
    if (!deckId || !cardId) {
        return { success: false, error: { message: 'Deck ID and Card ID are required' } };
    }

    try {
        // Get the cards that match the criteria
        const { data: cards, error: fetchError } = await supabase
            .from('deck_cards')
            .select('*')
            .eq('deck_id', deckId)
            .eq('card_id', cardId);
            
        if (fetchError) {
            console.error('Error fetching cards for deletion:', fetchError);
            return { success: false, error: fetchError };
        }
        
        // Filter by location if specified
        const cardsToDelete = location ? cards.filter(card => card.location === location) : cards;
        
        if (cardsToDelete.length === 0) {
            return { success: false, error: { message: 'No cards found to delete' } };
        }
        
        // Delete only the first matching card
        const { error } = await supabase
            .from('deck_cards')
            .delete()
            .eq('id', cardsToDelete[0].id);

        if (error) {
            console.error('Error removing card from deck:', error);
            return { success: false, error };
        }

        return { success: true };
    } catch (err) {
        console.error('Exception removing card from deck:', err);
        return { success: false, error: err };
    }
}

// Update deck name
async function updateDeckName(deckId, newName) {
    if (!deckId || !newName || newName.trim() === '') {
        return { success: false, error: { message: 'Deck ID and name are required' } };
    }

    try {
        // Get current user for permission check
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error('User authentication failed:', userError);
            return { success: false, error: { message: 'User not authenticated' } };
        }

        // First verify the deck exists and belongs to the user
        const { data: deckRecord, error: findError } = await supabase
            .from('decks')
            .select('*')
            .eq('deck_id', deckId)
            .single();
            
        if (findError || !deckRecord) {
            console.error('Deck not found:', findError);
            return { success: false, error: { message: 'Deck not found' } };
        }
        
        // Verify ownership
        if (deckRecord.user_id !== user.id) {
            return { success: false, error: { message: 'You can only edit your own decks' } };
        }

        // Update the deck name
        const { data, error } = await supabase
            .from('decks')
            .update({ name: newName.trim() })
            .eq('deck_id', deckId)
            .select();

        if (error) {
            console.error('Error updating deck name:', error);
            return { success: false, error };
        }

        return { success: true, deck: data[0] };
    } catch (err) {
        console.error('Exception updating deck name:', err);
        return { success: false, error: err };
    }
}



// Get all decks for the current user
async function getAllDecks() {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*');
    
    if (error) {
      console.error('Error fetching all decks:', error);
      return { success: false, error };
    }
    
    const decks = data || [];
    return { success: true, decks };
  } catch (err) {
    console.error('Exception fetching all decks:', err);
    return { success: false, decks: [] };
  }
}

export { createDeck, getUserDecks, addCardToMainDeck, addCardToExtraDeck, getDeckCards, deleteDeck, deleteCardFromDeck, updateDeckName, addCardToOwnedDeck, getAllDecks };
    

