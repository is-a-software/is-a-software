'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export function useUnauthorizedRedirect() {
  const router = useRouter();

  return useCallback(() => {
    logout();
    router.replace('/signin');
  }, [router]);
}
