/**
 * Deck manager — stubs only. Implement later (mock localStorage or Supabase).
 * Same return shapes so UI can call these; you fill in the logic when ready.
 */

export async function getUserDecks() {
  // Implement: Supabase .from('decks').select('*') or mock localStorage; return { success, decks } or { success: false, error }
  return { success: true as const, decks: [] };
}

export async function createDeck(_name: string, _description = '') {
  // Implement: insert deck (Supabase or mock); return { success, deck } or { success: false, error }
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function getDeckCards(_deckId: string) {
  // Implement: Supabase .from('deck_cards').eq('deck_id', deckId) or mock; return { success, cards } or { success: false, error }
  return { success: true as const, cards: [] };
}

export async function addCardToMainDeck(_deckId: string, _cardId: string, _quantity = 1) {
  // Implement: insert one row location 'main' (enforce 60 main, 3 per card); return { success, data } or { success: false, error }
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function addCardToExtraDeck(_deckId: string, _cardId: string, _quantity = 1) {
  // Implement: insert one row location 'extra' (enforce 15 extra, 3 per card); return { success, data } or { success: false, error }
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function deleteCardFromDeck(_deckId: string, _cardId: string, _location: string | null) {
  // Implement: delete one matching row; return { success } or { success: false, error }
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function deleteDeck(_deckId: string) {
  // Implement: delete deck_cards then deck (block "Owned Cards"); return { success } or { success: false, error }
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function updateDeckName(_deckId: string, _newName: string) {
  // Implement: update decks.name by deck_id; return { success, deck } or { success: false, error }
  return { success: false as const, error: { message: 'Not implemented' } };
}

export async function getAllDecks() {
  return getUserDecks();
}
