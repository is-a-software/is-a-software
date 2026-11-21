'use client';

import { useEffect, useState } from 'react';
import ErrorBanner from '@/components/ErrorBanner';

const MESSAGES = {
  email_not_verified: 'Your account email is not verified. Verify it with Google and try again.',
  account_conflict: 'This email is already linked to a different account. Contact support to sort it out.',
  sign_in_failed: 'Sign-in did not complete. Please try again.',
  expired: 'Your sign-in link expired. Please try again.'
};

// Shows why a Central Auth sign-in came back unsuccessful (?auth_error=...), then clears it from the URL.
export default function AuthErrorNotice() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('auth_error');
    if (!code) return;
    setMessage(MESSAGES[code] || MESSAGES.sign_in_failed);
    params.delete('auth_error');
    const query = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : ''));
  }, []);

  if (!message) return null;
  return (
    <div className="max-w-md mx-auto px-4 pt-28 -mb-20">
      <ErrorBanner error={message} />
    </div>
  );
}
