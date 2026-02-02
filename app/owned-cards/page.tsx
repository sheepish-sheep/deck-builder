'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { ensureOwnedCardsDeck, getCurrentUser } from '@/lib/auth';
import { addCardToMainDeck, deleteCardFromDeck, getDeckCards, getUserDecks } from '@/lib/deck-manager';

type DeckCardRow = { id?: string; deck_id: string; card_id: string; location: string; quantity?: number };
type ApiCard = { id: number; name: string; type?: string; card_images?: { image_url: string }[] };

const MAX_CARD_INFO_FETCH = 40;

export default function OwnedCardsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ownedDeckId, setOwnedDeckId] = useState<string | null>(null);
  const [cards, setCards] = useState<DeckCardRow[]>([]);
  const [cardInfoMap, setCardInfoMap] = useState<Record<string, { name: string; image_url?: string }>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ApiCard[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addById, setAddById] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.replace('/login');
        setLoading(false);
        return;
      }
      getUserDecks().then((result) => {
        if (!result.success) {
          setLoading(false);
          return;
        }
        const owned = result.decks?.find((d) => d.name === 'Owned Cards');
        if (!owned) {
          setLoading(false);
          return;
        }
        const deckId = owned.deck_id ?? (owned as { id?: string }).id;
        setOwnedDeckId(deckId ?? null);
        if (deckId) {
          getDeckCards(deckId).then((res) => {
            if (res.success) setCards(res.cards ?? []);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    });
  }, [router]);

  useEffect(() => {
    if (cards.length === 0) {
      setCardInfoMap({});
      return;
    }
    const uniqueIds = Array.from(new Set(cards.map((c) => String(c.card_id)))).slice(0, MAX_CARD_INFO_FETCH);
    let cancelled = false;
    Promise.all(
      uniqueIds.map((id) =>
        fetch(`/api/cards/${id}`).then((res) => (res.ok ? res.json() : null))
      )
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, { name: string; image_url?: string }> = {};
      results.forEach((data, i) => {
        const id = uniqueIds[i];
        const card = Array.isArray(data) ? data[0] : data;
        if (card?.name) next[id] = { name: card.name, image_url: card.card_images?.[0]?.image_url };
      });
      setCardInfoMap((prev) => ({ ...prev, ...next }));
    });
    return () => { cancelled = true; };
  }, [cards]);

  async function refetchCards(deckId?: string | null) {
    const id = deckId ?? ownedDeckId;
    if (!id) return;
    const result = await getDeckCards(id);
    if (result.success) setCards(result.cards ?? []);
  }

  async function handleRemove(card: DeckCardRow) {
    if (!ownedDeckId) return;
    const result = await deleteCardFromDeck(ownedDeckId, String(card.card_id), card.location);
    if (result.success) await refetchCards();
  }

  async function handleSearch() {
    setSearchLoading(true);
    setAddError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('name', searchQuery.trim());
      const res = await fetch(`/api/cards?${params.toString()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setSearchResults(list);
      if (list.length === 0 && searchQuery.trim()) {
        setAddError('No cards found. Try "Blue-Eyes" or "Dark Magician".');
      } else if (!res.ok) {
        setAddError('Search failed.');
      }
    } catch {
      setSearchResults([]);
      setAddError('Search failed. Check connection.');
    } finally {
      setSearchLoading(false);
    }
  }

  async function getOrCreateOwnedDeckId(): Promise<string | null> {
    await ensureOwnedCardsDeck();
    const result = await getUserDecks();
    if (!result.success) return null;
    const owned = result.decks?.find((d) => d.name === 'Owned Cards');
    const deckId = owned ? (owned.deck_id ?? (owned as { id?: string }).id) : null;
    if (deckId) setOwnedDeckId(deckId);
    return deckId ?? null;
  }

  async function handleAddToCollection(card: ApiCard) {
    setAddError(null);
    let deckId = ownedDeckId;
    if (!deckId) {
      deckId = await getOrCreateOwnedDeckId();
      if (!deckId) {
        setAddError('Could not create Owned Cards deck. Visit Home first or check Supabase.');
        return;
      }
    }
    const result = await addCardToMainDeck(deckId, String(card.id));
    if (result.success) await refetchCards(deckId);
    else setAddError(result.error?.message ?? 'Failed to add');
  }

  async function handleAddById() {
    const id = addById.trim();
    if (!id) return;
    setAddError(null);
    let deckId = ownedDeckId;
    if (!deckId) {
      deckId = await getOrCreateOwnedDeckId();
      if (!deckId) {
        setAddError('Could not create Owned Cards deck. Visit Home first or check Supabase.');
        return;
      }
    }
    try {
      const res = await fetch(`/api/cards/${id}`);
      if (!res.ok) {
        setAddError('Card not found');
        return;
      }
      const data = await res.json();
      const card = Array.isArray(data) ? data[0] : data;
      if (!card?.id) {
        setAddError('Card not found');
        return;
      }
      const result = await addCardToMainDeck(deckId, String(card.id));
      if (result.success) {
        await refetchCards(deckId);
        setAddById('');
      } else {
        setAddError(result.error?.message ?? 'Failed to add');
      }
    } catch {
      setAddError('Failed to fetch card');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card className="backdrop-blur-md bg-slate-800/80 border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="py-12">
            <p className="text-center text-blue-300">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <header className="flex justify-between items-center mb-8 border-b border-blue-500/30 pb-4">
        <h1 className="text-3xl font-bold text-blue-400 page-title">Owned Cards</h1>
        <Button className="btn-glow bg-blue-600 hover:bg-blue-500 text-white" asChild>
          <Link href="/home">Back to Decks</Link>
        </Button>
      </header>
      <Card className="backdrop-blur-md bg-slate-800/80 border border-blue-500/30 shadow-lg shadow-blue-500/10">
        <CardHeader className="border-b border-blue-500/30 pb-4">
          <CardTitle className="text-xl text-blue-300">Your owned cards</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!ownedDeckId ? (
            <p className="text-sm text-gray-400">No Owned Cards deck yet. Search below and click Add to create it and add your first card.</p>
          ) : cards.length === 0 ? (
            <p className="text-sm text-gray-400">No cards in your collection yet. Search and add below.</p>
          ) : (
            <div className="space-y-2">
              {cards.map((card, index) => {
                const info = cardInfoMap[String(card.card_id)];
                return (
                  <div
                    key={card.id ?? `${card.card_id}-${index}`}
                    className="flex items-center gap-2 rounded border border-blue-500/30 bg-slate-800/40 px-2 py-1 text-sm text-blue-200"
                  >
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" aria-label="Owned" />
                    {info?.image_url && (
                      <Image
                        src={info.image_url}
                        alt=""
                        width={40}
                        height={58}
                        className="h-10 w-auto rounded border border-blue-500/30"
                      />
                    )}
                    <span className="flex-1 truncate">{info?.name ?? card.card_id}</span>
                    {card.quantity != null && card.quantity > 1 && (
                      <span className="text-gray-500">×{card.quantity}</span>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleRemove(card)}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-blue-500/30 space-y-4">
            <CardTitle className="text-lg text-blue-300">Search & add cards from API</CardTitle>
            <div className="space-y-2">
              <Label htmlFor="owned-search" className="text-blue-100">Search by name</Label>
              <div className="flex gap-2">
                <Input
                  id="owned-search"
                  placeholder="e.g. Dark Magician"
                  className="bg-slate-800/80 text-blue-100 border-blue-500/50 flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  type="button"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={handleSearch}
                  disabled={searchLoading}
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="owned-add-id" className="text-blue-100">Add by card ID</Label>
              <div className="flex gap-2">
                <Input
                  id="owned-add-id"
                  placeholder="e.g. 89631139"
                  className="bg-slate-800/80 text-blue-100 border-blue-500/50 flex-1 font-mono"
                  value={addById}
                  onChange={(e) => setAddById(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddById()}
                />
                <Button
                  type="button"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddById(); }}
                >
                  Add
                </Button>
              </div>
            </div>
            {addError && <p className="text-xs text-red-400">{addError}</p>}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-auto">
                <p className="text-xs text-gray-400">Search results — click Add to add to your collection</p>
                {searchResults.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center gap-2 rounded border border-blue-500/30 bg-slate-800/40 p-2"
                  >
                    {card.card_images?.[0]?.image_url && (
                      <Image
                        src={card.card_images[0].image_url}
                        alt=""
                        width={40}
                        height={58}
                        className="h-10 w-auto rounded border border-blue-500/30"
                      />
                    )}
                    <span className="flex-1 truncate text-sm text-blue-200">{card.name}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 text-xs cursor-pointer"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCollection(card); }}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
