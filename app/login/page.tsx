'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { signInWithGoogle } from '@/lib/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    const result = await signInWithGoogle();
    if (result.success) {
      const url = result.data?.url;
      window.location.href = url ?? '/home';
    } else {
      const message = 'message' in result.error ? result.error.message : String(result.error);
      setError(message);
    }
  }

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
            onClick={handleSignIn}
          >
            Sign in with Google
          </Button>
          {error && (
            <div className="text-sm text-center space-y-1" role="alert">
              <p className="text-red-400">{error}</p>
              {error === 'Supabase not configured' && (
                <div className="text-gray-400 text-xs max-w-sm mx-auto space-y-2">
                  <p>
                    Add <code className="bg-slate-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                    <code className="bg-slate-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{' '}
                    <code className="bg-slate-800 px-1 rounded">.env.local</code> (same folder as <code className="bg-slate-800 px-1 rounded">package.json</code>), then restart the dev server.
                  </p>
                  <p className="text-gray-500">
                    Client: URL = {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'yes' : 'no'}, Key = {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'yes' : 'no'}
                  </p>
                  <p className="text-gray-500">
                    Run <code className="bg-slate-800 px-1 rounded">npm run dev</code> from the folder that contains <code className="bg-slate-800 px-1 rounded">package.json</code>.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
