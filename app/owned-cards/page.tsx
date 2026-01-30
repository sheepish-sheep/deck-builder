'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

// Implement: find "Owned Cards" deck (getUserDecks → by name), getDeckCards(ownedDeckId), list cards, optional add/remove
export default function OwnedCardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-primary">Owned Cards</h1>
        <Button asChild>
          <Link href="/home">Back to Decks</Link>
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Your owned cards</CardTitle>
          <CardDescription>Implement: resolve Owned Cards deck, list cards (used for ★ in deck builder)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Implement in lib/deck-manager + this page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
