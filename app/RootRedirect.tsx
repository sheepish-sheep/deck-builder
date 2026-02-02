'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

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
