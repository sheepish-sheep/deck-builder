'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * Phase 1 (mock): Keep decks in state or localStorage; "New Deck" prompts for name and appends; "Sign Out" clears stub and redirects to /login; link each deck to /deck/[id].
 * Phase 2 (Supabase): On load getCurrentUser() and redirect to /login if null; fetch decks with getUserDecks(); New Deck → createDeck(); Sign Out → signOut(); add delete deck (except "Owned Cards") with deleteDeck().
 */
export default function HomePage() {
  const decks: { deck_id: string; name: string; created_at?: string }[] = [];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <header className="sticky top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-blue-500/30 shadow-lg shadow-blue-500/10 z-20 py-4 px-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-400 page-title flex items-center">
            My Decks
          </h1>
          <div className="flex items-center gap-2">
            <Button
              className="btn-glow bg-yellow-400/90 hover:bg-yellow-300 text-slate-900 font-semibold"
              asChild
            >
              <Link href="/owned-cards">Owned Cards</Link>
            </Button>
            <Button className="btn-glow bg-blue-600 hover:bg-blue-500 text-white" type="button">
              New Deck (implement)
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" asChild>
              <Link href="/login">Sign Out (implement)</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="bg-slate-800/80 backdrop-blur-md rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-300 mb-4 border-b border-blue-500/30 pb-2">
          Your Deck Collection
        </h2>
        <p className="text-gray-400 text-sm mb-4">Implement: load from getUserDecks(), link to /deck/[id], delete deck</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.length === 0 ? (
            <p className="text-blue-300/70 col-span-full">No decks. Implement createDeck and getUserDecks.</p>
          ) : (
            decks.map((d) => (
              <Link key={d.deck_id} href={`/deck/${d.deck_id}`}>
                <div className="backdrop-blur-md bg-slate-900/40 border border-blue-500/30 rounded-lg p-4 hover:border-blue-400/60 hover:bg-slate-800/60 transition-all cursor-pointer">
                  <h3 className="text-lg font-semibold text-blue-300">{d.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
