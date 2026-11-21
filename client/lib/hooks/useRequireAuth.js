'use client';

import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';
import { startSignIn } from '@/lib/api';

export function useRequireAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      startSignIn();
      return;
    }

    setIsAuthed(true);
    setIsCheckingAuth(false);
  }, []);

  return { isAuthed, isCheckingAuth };
}
