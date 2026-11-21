'use client';

import { useEffect } from 'react';
import ProtectedPageLoader from '@/components/ProtectedPageLoader';
import { startSignIn } from '@/lib/api';

// Every "Sign In" in the app routes here; it hands straight off to the backend, which redirects to Central Auth.
export default function SignIn() {
  useEffect(() => {
    startSignIn();
  }, []);

  return <ProtectedPageLoader message="Redirecting to sign in..." />;
}
