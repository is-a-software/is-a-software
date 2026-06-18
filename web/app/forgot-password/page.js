'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authApi } from '@/lib/api';
import ErrorBanner from '@/components/ErrorBanner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      // Still show success to avoid email enumeration
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-96px)] flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full mx-auto space-y-8">

          {!sent ? (
            <>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">Forgot password?</h1>
                <p className="text-slate-300">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <ErrorBanner error={error} />

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-glass"
                    disabled={isLoading}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <div className="text-center">
                <Link href="/signin" className="text-slate-400 hover:text-white text-sm transition-colors">
                  ← Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl p-8 space-y-4 text-center">
              {/* Mail icon */}
              <div
                className="mx-auto h-14 w-14 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-white">Check your inbox</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  If an account with <span className="text-slate-200">{email}</span> exists,
                  we've sent a password reset link. It may take a minute to arrive.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Try a different email
                </button>
                <div>
                  <Link href="/signin" className="btn-primary inline-flex">
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
