'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

// Implement: getCurrentUser(); if !user redirect to /login. Fetch decks (getUserDecks), New Deck (createDeck), Sign Out (signOut)
export default function HomePage() {
  const decks: { deck_id: string; name: string; created_at?: string }[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-primary">My Decks</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href="/owned-cards">Owned Cards</Link>
          </Button>
          <Button type="button">New Deck (implement)</Button>
          <Button variant="destructive" asChild>
            <Link href="/login">Sign Out (implement)</Link>
          </Button>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Your Deck Collection</CardTitle>
          <CardDescription>Implement: load from getUserDecks(), link to /deck/[id], delete deck</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.length === 0 ? (
              <p className="text-muted-foreground col-span-full">No decks. Implement createDeck and getUserDecks.</p>
            ) : (
              decks.map((d) => (
                <Link key={d.deck_id} href={`/deck/${d.deck_id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{d.name}</CardTitle>
                      <CardDescription>
                        {d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
