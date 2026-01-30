/**
 * Deck manager stubs — implement with Supabase when DB is rebuilt.
 * Tables: decks (deck_id, user_id, name, description, created_at), deck_cards (deck_id, card_id, location, quantity).
 */

export async function getUserDecks() {
  // Implement: supabase.from('decks').select('*')
  return { success: true as const, decks: [] };
}

export async function createDeck(_name: string, _description = '') {
  // Implement: insert deck for current user
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function getDeckCards(_deckId: string) {
  // Implement: supabase.from('deck_cards').select('*').eq('deck_id', deckId)
  return { success: true as const, cards: [] };
}

export async function addCardToMainDeck(_deckId: string, _cardId: string, _quantity = 1) {
  // Implement: insert into deck_cards (location: 'main'), enforce main deck limits (60 cards, 3 per card)
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function addCardToExtraDeck(_deckId: string, _cardId: string, _quantity = 1) {
  // Implement: insert into deck_cards (location: 'extra'), enforce extra deck limits (15 cards, 3 per card)
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function deleteCardFromDeck(_deckId: string, _cardId: string, _location: string | null) {
  // Implement: delete one matching row from deck_cards
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function deleteDeck(_deckId: string) {
  // Implement: delete deck_cards then deck (check ownership)
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function updateDeckName(_deckId: string, _newName: string) {
  // Implement: supabase.from('decks').update({ name }).eq('deck_id', deckId)
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function getAllDecks() {
  return getUserDecks();
}
