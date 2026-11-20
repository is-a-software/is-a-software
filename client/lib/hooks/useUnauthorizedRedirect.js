'use client';

import { useCallback } from 'react';
import { logout } from '@/lib/auth';
import { startSignIn } from '@/lib/api';

export function useUnauthorizedRedirect() {
  return useCallback(() => {
    logout();
    startSignIn();
  }, []);
}
