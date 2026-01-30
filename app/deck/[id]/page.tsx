'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

/**
 * Phase 1 (mock): Search via GET /api/cards; keep main and extra deck in React state (or localStorage by deck id); add from search (Fusion/Xyz/Synchro/Link → extra, else main); remove on double-click; deck name editable in state. Show selected card image when a card is clicked.
 * Phase 2 (Supabase): Load deck name + cards with getDeckCards(deckId); save add/remove with addCardToMainDeck, addCardToExtraDeck, deleteCardFromDeck; save name with updateDeckName; show ★ on cards that appear in "Owned Cards" deck; enforce 60 main, 15 extra, 3 per card.
 */
export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

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
        <h1 className="text-2xl font-bold text-blue-300 page-title">Deck — {id} (implement name + edit)</h1>
        <div className="w-20" />
      </nav>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-auto">
        <Card className="backdrop-blur-md bg-slate-900/40 border border-blue-500/30 rounded-lg overflow-hidden shadow-lg shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="text-blue-300">Selected Card</CardTitle>
            <CardDescription className="text-gray-400">Implement: show card image/details when a card is clicked</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">No card selected</p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-md bg-slate-900/40 border border-blue-500/30 rounded-lg overflow-hidden shadow-lg shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="text-blue-300">Deck List</CardTitle>
            <CardDescription className="text-gray-400">Implement: getDeckCards, render main/extra, double-click remove</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Implement getDeckCards and display.</p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-md bg-slate-900/40 border border-blue-500/30 rounded-lg overflow-hidden shadow-lg shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="text-blue-300">Card Search</CardTitle>
            <CardDescription className="text-gray-400">Implement: GET /api/cards with query, add to main/extra by type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-blue-100">Search</Label>
              <Input id="search" placeholder="Search cards..." className="bg-slate-800/80 text-blue-100 border-blue-500/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-100">Type</Label>
              <Select>
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
            <p className="text-xs text-gray-400">Implement: fetch /api/cards, display results, add to deck.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
