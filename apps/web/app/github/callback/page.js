'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedPageLoader from '@/components/ProtectedPageLoader';

function GitHubAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState({ message: 'Processing...', isError: false });
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const authenticated = searchParams.get('authenticated') === 'true';
    const starred = searchParams.get('starred') === 'true';
    const username = searchParams.get('username') || '';
    const error = searchParams.get('error') || '';
    const token = searchParams.get('token');

    // Save token if provided
    if (token && token !== 'null' && token !== '') {
      localStorage.setItem('token', token);
    }

    // Store GitHub auth state for main page to pick up
    const authState = {
      authenticated,
      starred,
      username,
      error,
      timestamp: Date.now()
    };
    
    localStorage.setItem('githubAuthState', JSON.stringify(authState));

    if (error) {
      setStatus({ 
        message: `Authentication failed: ${error}`, 
        isError: true 
      });
    } else if (!authenticated) {
      setStatus({ 
        message: 'Authentication failed. Please try again.', 
        isError: true 
      });
    } else if (starred) {
      setStatus({ 
        message: '✓ Success! GitHub connected and star verified.', 
        isError: false 
      });
    } else {
      setStatus({ 
        message: '✓ Success! GitHub connected. Please verify your star.', 
        isError: false 
      });
    }

    // Auto redirect after 2 seconds
    const timer = setTimeout(() => {
      router.push('/github');
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <section className="glass rounded-3xl p-8 md:p-10 space-y-3">
            <h1 className="text-4xl font-bold text-white">GitHub Authentication</h1>
            <p className="text-slate-300">Processing your GitHub connection...</p>
          </section>

          <section className="glass rounded-2xl p-6 space-y-4">
            <div className={`rounded-xl px-4 py-3 text-sm ${
              status.isError 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}>
              {status.message}
            </div>
            
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function GitHubAuthCallbackPage() {
  return (
    <Suspense fallback={<ProtectedPageLoader message="Loading..." />}>
      <GitHubAuthCallbackContent />
    </Suspense>
  );
}