'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { ensureOwnedCardsDeck, getCurrentUser, signOut } from '@/lib/auth';
import { createDeck, deleteDeck, getUserDecks } from '@/lib/deck-manager';

export default function HomePage() {
  const router = useRouter();
  const [decks, setDecks] = useState<{ deck_id: string; name: string; created_at?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDeck, setShowNewDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.replace('/login');
        setLoading(false);
        return;
      }
      ensureOwnedCardsDeck().then(() =>
        getUserDecks().then((result) => {
          if (result.success) setDecks(result.decks ?? []);
          setLoading(false);
        })
      );
    });
  }, [router]);

  const handleNewDeck = () => {
    setShowNewDeck(true);
  };

  const handleCreateDeck = (e?: React.FormEvent) => {
    e?.preventDefault();
    setCreateError(null);
    const name = newDeckName.trim();
    if (!name) return;
    createDeck(name).then((result) => {
      if (result.success) {
        setNewDeckName('');
        setShowNewDeck(false);
        getUserDecks().then((r) => {
          if (r.success) setDecks(r.decks ?? []);
        });
      } else {
        setCreateError(result.error?.message ?? 'Failed to create deck');
      }
    });
  };

  const handleSignOut = () => {
    signOut().then(() => router.replace('/login'));
  };

  const handleDeleteDeck = (e: React.MouseEvent, deckId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteDeck(deckId).then((result) => {
      if (result.success) {
        getUserDecks().then((r) => {
          if (r.success) setDecks(r.decks ?? []);
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card className="backdrop-blur-md bg-slate-900/40 border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="py-12">
            <p className="text-center text-blue-300">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <header className="sticky top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-blue-500/30 shadow-lg shadow-blue-500/10 z-20 py-4 px-6 mb-6 rounded-b-xl">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h1 className="text-3xl font-bold text-blue-400 page-title">My Decks</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="btn-glow bg-yellow-400/90 hover:bg-yellow-300 text-slate-900 font-semibold"
              asChild
            >
              <Link href="/owned-cards">Owned Cards</Link>
            </Button>
            <Button className="btn-glow bg-blue-600 hover:bg-blue-500 text-white" type="button" onClick={handleNewDeck}>
              New Deck
            </Button>
            {showNewDeck && (
              <form onSubmit={handleCreateDeck} className="flex items-end gap-2 relative z-10 flex-shrink-0">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="new-deck-name" className="text-xs text-blue-200">Deck name</Label>
                  <Input
                    id="new-deck-name"
                    value={newDeckName}
                    onChange={(e) => { setNewDeckName(e.target.value); setCreateError(null); }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateDeck())}
                    placeholder="Enter name"
                    className="bg-slate-800 text-blue-100 border-blue-500/50 h-9 w-48"
                    autoFocus
                  />
                </div>
                <Button type="button" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white h-9" onClick={() => handleCreateDeck()}>
                  Create
                </Button>
                <Button type="button" size="sm" variant="outline" className="h-9" onClick={(e) => { e.stopPropagation(); setShowNewDeck(false); setNewDeckName(''); setCreateError(null); }}>
                  Cancel
                </Button>
                {createError && <span className="text-xs text-red-400 whitespace-nowrap">{createError}</span>}
              </form>
            )}
            <Button className="bg-red-500 hover:bg-red-600 text-white" type="button" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <Card className="backdrop-blur-md bg-slate-800/80 border border-blue-500/30 shadow-lg shadow-blue-500/10">
        <CardHeader className="border-b border-blue-500/30 pb-4">
          <CardTitle className="text-xl text-blue-300">Your Deck Collection</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.length === 0 ? (
              <p className="text-blue-300/70 col-span-full">No decks.</p>
            ) : (
              decks
                .filter((d, i, arr) => d.name !== 'Owned Cards' || arr.findIndex((x) => x.name === 'Owned Cards') === i)
                .map((d) => {
                const deckId = d.deck_id ?? (d as { id?: string }).id ?? '';
                return (
                <div key={deckId} className="relative group">
                  <Link href={`/deck/${deckId}`}>
                    <Card className="backdrop-blur-md bg-slate-900/40 border border-blue-500/30 hover:border-blue-400/60 hover:bg-slate-800/60 transition-all cursor-pointer h-full">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-lg text-blue-300">{d.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-400 text-sm">
                          {d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  {d.name !== 'Owned Cards' && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => handleDeleteDeck(e, deckId)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ); })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
