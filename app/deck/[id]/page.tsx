'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import {
  addCardToExtraDeck,
  addCardToMainDeck,
  deleteCardFromDeck,
  getDeckCards,
  getUserDecks,
  updateDeckName,
} from '@/lib/deck-manager';

type DeckCardRow = { id?: string; deck_id: string; card_id: string; location: string; quantity?: number };

type ApiCard = { id: number; name: string; type: string; desc?: string; card_images?: { image_url: string }[] };

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [deckName, setDeckName] = useState('');
  const [deckCards, setDeckCards] = useState<DeckCardRow[]>([]);
  const [selectedCard, setSelectedCard] = useState<ApiCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState<ApiCard[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [cardInfoMap, setCardInfoMap] = useState<Record<string, { name: string; image_url?: string }>>({});

  const DECK_CARD_INFO_LIMIT = 80;

  async function refetchDeckCards() {
    if (!id) return;
    const result = await getDeckCards(id);
    if (result.success) setDeckCards(result.cards ?? []);
  }

  async function selectCardById(cardId: string) {
    try {
      const res = await fetch(`/api/cards/${cardId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCard(Array.isArray(data) ? data[0] : data);
      } else {
        setSelectedCard(null);
      }
    } catch {
      setSelectedCard(null);
    }
  }

  function selectCard(card: ApiCard | null) {
    setSelectedCard(card);
  }

  async function handleSearch() {
    setSearchLoading(true);
    setAddError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('name', searchQuery.trim());
      if (searchType !== 'all') params.set('type', searchType);
      const res = await fetch(`/api/cards?${params.toString()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setSearchResults(list);
      if (!res.ok || (list.length === 0 && searchQuery.trim())) {
        setAddError(list.length === 0 ? 'No cards found. Try a different name (e.g. "Blue-Eyes").' : 'Search failed.');
      } else {
        setAddError(null);
      }
    } catch {
      setSearchResults([]);
      setAddError('Search failed. Check connection.');
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleAddToMain(card: ApiCard) {
    if (!id) return;
    setAddError(null);
    const result = await addCardToMainDeck(id, String(card.id));
    if (result.success) await refetchDeckCards();
    else setAddError(result.error?.message ?? 'Failed to add');
  }

  async function handleAddToExtra(card: ApiCard) {
    if (!id) return;
    setAddError(null);
    const result = await addCardToExtraDeck(id, String(card.id));
    if (result.success) await refetchDeckCards();
    else setAddError(result.error?.message ?? 'Failed to add');
  }

  async function handleDeleteCard(card: DeckCardRow) {
    if (!id) return;
    const result = await deleteCardFromDeck(id, String(card.card_id), card.location);
    if (result.success) await refetchDeckCards();
  }

  const mainCards = deckCards.filter((c) => c.location === 'main');
  const extraCards = deckCards.filter((c) => c.location === 'extra');
  const mainCount = mainCards.reduce((s, c) => s + (Number(c.quantity) || 1), 0);
  const extraCount = extraCards.reduce((s, c) => s + (Number(c.quantity) || 1), 0);
  const MAIN_LIMIT = 60;
  const EXTRA_LIMIT = 15;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getCurrentUser().then((user) => {
      if (!user) {
        router.replace('/login');
        setLoading(false);
        return;
      }
      Promise.all([
        getDeckCards(id).then((result) => {
          if (result.success) setDeckCards(result.cards ?? []);
        }),
        getUserDecks().then((result) => {
          if (result.success) {
            const name = result.decks?.find((d) => (d.deck_id ?? (d as { id?: string }).id) === id)?.name ?? '';
            setDeckName(name);
          }
        }),
      ]).finally(() => setLoading(false));
    });
  }, [id, router]);

  useEffect(() => {
    if (deckCards.length === 0) {
      setCardInfoMap({});
      return;
    }
    const uniqueIds = Array.from(new Set(deckCards.map((c) => String(c.card_id)))).slice(0, DECK_CARD_INFO_LIMIT);
    let cancelled = false;
    Promise.all(
      uniqueIds.map((cid) =>
        fetch(`/api/cards/${cid}`).then((res) => (res.ok ? res.json() : null))
      )
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, { name: string; image_url?: string }> = {};
      results.forEach((data, i) => {
        const cid = uniqueIds[i];
        const card = Array.isArray(data) ? data[0] : data;
        if (card?.name) next[cid] = { name: card.name, image_url: card.card_images?.[0]?.image_url };
      });
      setCardInfoMap((prev) => ({ ...prev, ...next }));
    });
    return () => { cancelled = true; };
  }, [deckCards]);
  
  if (!id) {
    router.push('/home');
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-900">
      <nav className="flex justify-between items-center p-4 border-b border-blue-500/30 bg-slate-900/90 backdrop-blur-md z-50">
        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" asChild>
          <Link href="/home">← Back to Decks</Link>
        </Button>
        <input
          type="text"
          value={deckName || ''}
          onChange={(e) => setDeckName(e.target.value)}
          onBlur={() => deckName.trim() && updateDeckName(id, deckName.trim()).then((r) => r.success && setDeckName(deckName.trim()))}
          placeholder="Deck name"
          className="min-w-[8rem] max-w-[20rem] rounded border border-blue-500/30 bg-slate-800/80 px-2 py-1 text-2xl font-bold text-blue-300 placeholder:text-blue-300/50 focus:border-blue-400 focus:outline-none"
          aria-label="Deck name"
        />
        <div className="w-20" />
      </nav>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-auto">
        <Card className="quadrant-card backdrop-blur-md bg-slate-900/50 border border-blue-500/40 rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-blue-300">Selected Card</CardTitle>
            <CardDescription className="text-gray-400">Details when a card is clicked</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedCard ? (
              <p className="text-sm text-gray-400">—</p>
            ) : (
              <div className="space-y-2">
                {selectedCard.card_images?.[0]?.image_url && (
                  <Image
                    src={selectedCard.card_images[0].image_url}
                    alt={selectedCard.name}
                    width={250}
                    height={364}
                    className="w-full max-w-[250px] h-auto rounded border border-blue-500/30"
                  />
                )}
                <p className="font-semibold text-blue-200">{selectedCard.name}</p>
                <p className="text-xs text-gray-400">{selectedCard.type}</p>
                {selectedCard.desc && (
                  <p className="text-sm text-gray-300 line-clamp-4">{selectedCard.desc}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="quadrant-card backdrop-blur-md bg-slate-900/50 border border-blue-500/40 rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-blue-300">Deck List</CardTitle>
            <CardDescription className="text-gray-400">Main / Extra</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deckCards.length === 0 ? (
              <p className="text-sm text-gray-400">—</p>
            ) : (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-blue-300/80">Main ({mainCount}/{MAIN_LIMIT})</p>
                  {mainCards.map((card, index) => {
                    const info = cardInfoMap[String(card.card_id)];
                    return (
                      <div
                        key={card.id ?? `${card.card_id}-main-${index}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => selectCardById(String(card.card_id))}
                        onDoubleClick={(e) => { e.preventDefault(); handleDeleteCard(card); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') selectCardById(String(card.card_id)); }}
                        className="flex items-center gap-2 cursor-pointer rounded border border-blue-500/30 bg-slate-800/40 px-2 py-1 text-sm text-blue-200 hover:bg-slate-700/50"
                      >
                        {deckName === 'Owned Cards' && <Star className="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" aria-label="Owned" />}
                        {info?.image_url ? (
                          <Image
                            src={info.image_url}
                            alt=""
                            width={32}
                            height={47}
                            className="h-8 w-auto rounded border border-blue-500/30 flex-shrink-0"
                          />
                        ) : (
                          <span className="w-8 h-8 flex-shrink-0 rounded border border-blue-500/30 bg-slate-700/50 flex items-center justify-center text-xs font-mono text-gray-500">?</span>
                        )}
                        <span className="flex-1 truncate min-w-0">{info?.name ?? card.card_id}</span>
                        {card.quantity != null && card.quantity > 1 && (
                          <span className="text-gray-500 flex-shrink-0">×{card.quantity}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-blue-300/80">Extra ({extraCount}/{EXTRA_LIMIT})</p>
                  {extraCards.map((card, index) => {
                    const info = cardInfoMap[String(card.card_id)];
                    return (
                      <div
                        key={card.id ?? `${card.card_id}-extra-${index}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => selectCardById(String(card.card_id))}
                        onDoubleClick={(e) => { e.preventDefault(); handleDeleteCard(card); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') selectCardById(String(card.card_id)); }}
                        className="flex items-center gap-2 cursor-pointer rounded border border-blue-500/30 bg-slate-800/40 px-2 py-1 text-sm text-blue-200 hover:bg-slate-700/50"
                      >
                        {deckName === 'Owned Cards' && <Star className="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" aria-label="Owned" />}
                        {info?.image_url ? (
                          <Image
                            src={info.image_url}
                            alt=""
                            width={32}
                            height={47}
                            className="h-8 w-auto rounded border border-blue-500/30 flex-shrink-0"
                          />
                        ) : (
                          <span className="w-8 h-8 flex-shrink-0 rounded border border-blue-500/30 bg-slate-700/50 flex items-center justify-center text-xs font-mono text-gray-500">?</span>
                        )}
                        <span className="flex-1 truncate min-w-0">{info?.name ?? card.card_id}</span>
                        {card.quantity != null && card.quantity > 1 && (
                          <span className="text-gray-500 flex-shrink-0">×{card.quantity}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="quadrant-card backdrop-blur-md bg-slate-900/50 border border-blue-500/40 rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-blue-300">Card Search</CardTitle>
            <CardDescription className="text-gray-400">Search and add</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-blue-100">Search</Label>
              <Input
                id="search"
                placeholder="Search cards..."
                className="bg-slate-800/80 text-blue-100 border-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-100">Type</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="bg-slate-800/80 text-blue-100 border-blue-500/50">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Effect Monster">Effect Monster</SelectItem>
                  <SelectItem value="Spell Card">Spell Card</SelectItem>
                  <SelectItem value="Trap Card">Trap Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white"
              onClick={handleSearch}
              disabled={searchLoading}
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </Button>
            {addError && <p className="text-xs text-red-400">{addError}</p>}
            <div className="space-y-2 max-h-48 overflow-auto">
              {searchResults.length === 0 && !searchLoading && (
                <p className="text-xs text-gray-400">Search by name (e.g. Blue-Eyes, Dark Magician). Results appear here.</p>
              )}
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
                      className="h-10 w-auto cursor-pointer rounded border border-blue-500/30 hover:opacity-90"
                      onClick={() => selectCard(card)}
                    />
                  )}
                  <span className="flex-1 truncate text-sm text-blue-200" onClick={() => selectCard(card)}>{card.name}</span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 text-xs"
                      onClick={() => handleAddToMain(card)}
                      disabled={mainCount >= MAIN_LIMIT}
                    >
                      Main
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 text-xs"
                      onClick={() => handleAddToExtra(card)}
                      disabled={extraCount >= EXTRA_LIMIT}
                    >
                      Extra
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
