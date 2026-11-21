'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedPageLoader from '@/components/ProtectedPageLoader';
import { authApi } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

// The backend redirects here after Central Auth with a one-time code in the URL fragment.
export default function AuthCallback() {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // the code is single-use; never send it twice
    started.current = true;

    const code = new URLSearchParams(window.location.hash.slice(1)).get('code');
    // Drop the code from the address bar and history before doing anything else.
    window.history.replaceState(null, '', window.location.pathname);

    if (!code) {
      router.replace('/?auth_error=sign_in_failed');
      return;
    }

    authApi
      .exchange(code)
      .then(({ token, user }) => {
        setToken(token);
        setUser(user);
        router.replace('/dashboard');
      })
      .catch(() => router.replace('/?auth_error=expired'));
  }, [router]);

  return <ProtectedPageLoader message="Signing you in..." />;
}
