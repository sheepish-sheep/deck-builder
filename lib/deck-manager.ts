import {supabase, hasSupabaseConfig} from './supabase';

export async function getUserDecks() {
  if (hasSupabaseConfig()) {
    const { data, error } = await supabase.from('decks').select('*');
    if (error) return { success: false as const, error: { message: error.message } };
    return { success: true as const, decks: data };
  }
  return { success: true as const, decks: [] };
}

export async function createDeck(_name: string, _description = '') {
  if (hasSupabaseConfig()) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: { message: 'Not signed in' } };
    const { data, error } = await supabase.from('decks').insert({ user_id: user.id, name: _name, description: _description }).select().single();
    if (error) return { success: false as const, error: { message: error.message } };
    return { success: true as const, deck: data };
  }
  return { success: false as const, error: { message: 'error creating deck' } };
}

export async function getDeckCards(_deckId: string) {
  if (hasSupabaseConfig()) {
    const { data, error } = await supabase.from('deck_cards').select('*').eq('deck_id', _deckId);
    if (error) return { success: false as const, error: { message: error.message } };
    return { success: true as const, cards: data ?? [] };
  }
  return { success: true as const, cards: [] };
}

const MAX_COPIES_PER_CARD = 3;

async function getCurrentCardCount(deckId: string, cardId: string): Promise<number> {
  const { data } = await supabase.from('deck_cards').select('quantity').eq('deck_id', deckId).eq('card_id', cardId);
  return (data ?? []).reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
}

export async function addCardToMainDeck(_deckId: string, _cardId: string, _quantity = 1) {
  if (hasSupabaseConfig()) {
    const current = await getCurrentCardCount(_deckId, _cardId);
    if (current + _quantity > MAX_COPIES_PER_CARD) {
      return { success: false as const, error: { message: `Max ${MAX_COPIES_PER_CARD} copies per card` } };
    }
    const { data, error } = await supabase.from('deck_cards').insert({ deck_id: _deckId, card_id: _cardId, location: 'main', quantity: _quantity }).select().single();
    if (error) return { success: false as const, error: { message: error.message } };
    return { success: true as const, data: data };
  }
  return { success: false as const, error: { message: 'error adding card to main deck' } };
}

export async function addCardToExtraDeck(_deckId: string, _cardId: string, _quantity = 1) {
  if (hasSupabaseConfig()) {
    const current = await getCurrentCardCount(_deckId, _cardId);
    if (current + _quantity > MAX_COPIES_PER_CARD) {
      return { success: false as const, error: { message: `Max ${MAX_COPIES_PER_CARD} copies per card` } };
    }
    const { data, error } = await supabase.from('deck_cards').insert({ deck_id: _deckId, card_id: _cardId, location: 'extra', quantity: _quantity }).select().single();
    if (error) return { success: false as const, error: { message: error.message } };
    return { success: true as const, data: data };
  }
  return { success: false as const, error: { message: 'error adding card to extra deck' } };
}

export async function deleteCardFromDeck(_deckId: string, _cardId: string, _location: string | null) {
  if (hasSupabaseConfig()) {
    const current = await getCurrentCardCount(_deckId, _cardId);
    if (current === 0) {
      return { success: false as const, error: { message: "don't have card in deck" } };
    }
    let query = supabase.from('deck_cards').delete().eq('deck_id', _deckId).eq('card_id', _cardId);
    if (_location != null) query = query.eq('location', _location);
    const { data, error } = await query.select();
    if (error) return { success: false as const, error: { message: error.message } };
    return { success: true as const, data };
  }
  return { success: false as const, error: { message: 'error removing card from deck' } };
}

export async function deleteDeck(_deckId: string) {
  if (hasSupabaseConfig()) {
    const {error} = await supabase.from('deck_cards').delete().eq('deck_id', _deckId);
    if (error) return { success: false as const, error: { message: error.message } };
    const {error: error2} = await supabase.from('decks').delete().eq('id', _deckId);
    if (error2) return { success: false as const, error: { message: error2.message } };
    return { success: true as const };
  }
  return { success: false as const, error: { message: 'error deleting deck' } };
}

export async function updateDeckName(_deckId: string, _newName: string) {
  if (hasSupabaseConfig()) {
    const {data, error} = await supabase.from('decks').update({name: _newName}).eq('id', _deckId).select().single();
    if (error) return {success: false as const, error: {message: error.message}};
    return {success: true as const, data: data};
  }
  return {success: false as const, error: {message: 'error updating deck name'}};
}

export async function getAllDecks() {
  return getUserDecks();
}
