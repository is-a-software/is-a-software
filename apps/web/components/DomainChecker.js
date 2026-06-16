'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { domainApi } from '@/lib/api';

export default function DomainChecker() {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState(null); // null, 'checking', 'available', 'taken', 'error'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // ---------- AUTH CHECK FUNCTION ----------
  // Ye function multiple jagah check karega (localStorage, sessionStorage, cookies)
  const checkAuth = () => {
    // --- YAHAN APNI TOKEN KEY LIKH DE ---
    // Agar teri app 'token' ki jagah koi aur key use karti hai (jaise 'accessToken', 'auth', 'user' etc.)
    // to neeche diye gaye array mein woh key daal de.
    const possibleKeys = ['token', 'accessToken', 'authToken', 'jwt', 'userToken', 'auth', 'user'];
    // ------------------------------------

    // 1. Check localStorage
    for (let key of possibleKeys) {
      if (localStorage.getItem(key)) return true;
    }
    // 2. Check sessionStorage
    for (let key of possibleKeys) {
      if (sessionStorage.getItem(key)) return true;
    }
    // 3. Check cookies (agar httpOnly nahi hai to)
    if (document.cookie && (
      document.cookie.includes('session=') ||
      document.cookie.includes('token=') ||
      document.cookie.includes('auth=')
    )) return true;
    
    return false;
  };
  // ---------------------------------------

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setStatus('checking');
    setErrorMessage('');

    try {
      const result = await domainApi.checkAvailability(domain.trim().toLowerCase());
      const isAvailable = !!result?.available;
      setStatus(isAvailable ? 'available' : 'taken');
    } catch (error) {
      setErrorMessage(error?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // dubara check karo (safety ke liye)
    if (checkAuth()) {
      router.push('/dashboard');
    } else {
      router.push(`/signup?domain=${domain}`);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-3xl p-8 md:p-12 space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Check Your Domain</h2>
            <p className="text-slate-400">See if your perfect subdomain is available</p>
          </div>

          <form onSubmit={handleCheck} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    setStatus(null);
                  }}
                  placeholder="Enter subdomain name"
                  className="input-glass w-full"
                  disabled={loading}
                  maxLength={63}
                />
                {domain && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    .is-a.software
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Checking...' : 'Check'}
              </button>
            </div>

            {status === 'checking' && (
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm animate-pulse">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                Checking availability...
              </div>
            )}

            {status === 'available' && (
              <div className="space-y-4">
                <div className="p-4 bg-white/8 border border-white/20 rounded-lg text-center">
                  <p className="status-good font-medium text-lg mb-2">✓ Available!</p>
                  <p className="text-slate-300 text-sm">{domain}.is-a.software is ready to claim</p>
                </div>
                <button
                  onClick={handleContinue}
                  className="btn-primary w-full text-center"
                >
                  Continue
                </button>
              </div>
            )}

            {status === 'taken' && (
              <div className="p-4 bg-white/8 border border-white/20 rounded-lg text-center">
                <p className="status-bad font-medium mb-1">Already taken</p>
                <p className="text-slate-300 text-sm">Try a different name or sign in to manage your domains</p>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-white/8 border border-white/20 rounded-lg text-center">
                <p className="text-slate-300 text-sm">{errorMessage || 'Something went wrong. Please try again.'}</p>
              </div>
            )}
          </form>

          {/* Agar user login nahi hai to hi ye links dikhao */}
          {!isAuthenticated && (
            <div className="pt-4 space-y-3 text-center text-sm">
              <p className="text-slate-400">
                Already have a domain?{' '}
                <Link href="/signin" className="accent-ice hover:text-white transition-colors">
                  Sign in
                </Link>
              </p>
              <p className="text-slate-500">
                New here?{' '}
                <Link href="/signup" className="accent-ice hover:text-white transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}