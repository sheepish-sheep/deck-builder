'use client';

import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

/**
 * Phase 1 (mock): On "Sign in" click set a stub session (e.g. localStorage.setItem('loggedIn', 'true')) and redirect to /home.
 * Phase 2 (Supabase): On click call await signInWithGoogle(); on success the OAuth flow redirects; on error show a message.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="relative z-10 w-full max-w-md backdrop-blur-md bg-slate-900/40 border border-blue-500/30 rounded-lg overflow-hidden shadow-lg shadow-blue-500/10">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-blue-400 page-title">
            Welcome
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Sign in to manage your decks
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="w-full btn-glow bg-blue-600 hover:bg-blue-500 text-white"
            size="lg"
            onClick={() => {
              // Phase 1: stub redirect. Phase 2: await signInWithGoogle(); handle redirect/error.
              window.location.href = '/home';
            }}
          >
            Sign in with Google (stub)
          </Button>
          <p className="text-sm text-gray-400 text-center">
            Phase 1: stub session (e.g. localStorage). Phase 2: wire lib/auth.ts signInWithGoogle here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
