'use client';

import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

// Implement: signInWithGoogle() and session handling; protect /home when not logged in
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/30 bg-card/95">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your decks
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              // Implement: await signInWithGoogle(); handle redirect
              window.location.href = '/home';
            }}
          >
            Sign in with Google (stub)
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Implement auth in lib/auth.ts and wire here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
