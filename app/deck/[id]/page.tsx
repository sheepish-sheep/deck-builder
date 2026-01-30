'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

// Implement: load deck name + cards (getDeckCards), card search (GET /api/cards), add/remove (addCardToMainDeck etc), updateDeckName, owned ★ from Owned Cards deck
export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  if (!id) {
    router.push('/home');
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <nav className="flex justify-between items-center p-4 border-b border-border bg-card/90">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/home">← Back to Decks</Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">Deck — {id} (implement name + edit)</h1>
        <div className="w-20" />
      </nav>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Selected Card</CardTitle>
            <CardDescription>Implement: show card image/details when a card is clicked</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No card selected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deck List</CardTitle>
            <CardDescription>Implement: getDeckCards, render main/extra, double-click remove</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Implement getDeckCards and display.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card Search</CardTitle>
            <CardDescription>Implement: GET /api/cards with query, add to main/extra by type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input id="search" placeholder="Search cards..." />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select>
                <SelectTrigger>
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
            <p className="text-xs text-muted-foreground">Implement: fetch /api/cards, display results, add to deck.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
