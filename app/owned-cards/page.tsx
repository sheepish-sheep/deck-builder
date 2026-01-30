'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * Phase 1 (mock): Keep a list of owned card IDs in state or localStorage; display count or placeholder list so the page and nav work.
 * Phase 2 (Supabase): Call getUserDecks(), find deck with name "Owned Cards", then getDeckCards(ownedDeckId) and render the list; optionally allow add/remove.
 */
export default function OwnedCardsPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <header className="flex justify-between items-center mb-8 border-b border-blue-500/30 pb-4">
        <h1 className="text-3xl font-bold text-blue-400 page-title">Owned Cards</h1>
        <Button className="btn-glow bg-blue-600 hover:bg-blue-500 text-white" asChild>
          <Link href="/home">Back to Decks</Link>
        </Button>
      </header>
      <div className="bg-slate-800/80 backdrop-blur-md rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 p-6">
        <h2 className="text-xl font-semibold text-blue-300 mb-4 border-b border-blue-500/30 pb-2">Your owned cards</h2>
        <p className="text-gray-400 text-sm mb-4">Implement: resolve Owned Cards deck, list cards (used for ★ in deck builder)</p>
        <p className="text-gray-400">Implement in lib/deck-manager + this page.</p>
      </div>
    </div>
  );
}
