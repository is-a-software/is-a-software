'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export function useRequireAuth() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/signin');
      setIsCheckingAuth(false);
      return;
    }

    setIsAuthed(true);
    setIsCheckingAuth(false);
  }, [router]);

  return { isAuthed, isCheckingAuth };
}
