'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

/**
 * Client-only: check session and redirect. Works with mock (localStorage) or real Supabase.
 */
export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) router.replace('/home');
      else router.replace('/login');
    });
  }, [router]);

  return null;
}
