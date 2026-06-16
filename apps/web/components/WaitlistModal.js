'use client';

import { useState, useEffect } from 'react';
import { useWaitlist } from '@/lib/waitlist';

export default function WaitlistModal() {
  const { isOpen, closeWaitlist } = useWaitlist();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage("You're on the list! We'll let you know when we're live.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Could not reach the server. Try again later.');
    }
  };

  const handleClose = () => {
    closeWaitlist();
    setStatus(null);
    setMessage('');
    setEmail('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg glass rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-3 text-center">
          <div className="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-sm text-yellow-300 mb-1">
            Not Live Yet
          </div>
          <h2 className="text-3xl font-bold text-white">Backend Migration in Progress</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We&apos;re rebuilding the backend. The dashboard, domain registration, and DNS
            management will be available once the migration is complete. Leave your email
            and we&apos;ll notify you the moment we&apos;re live.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus(null);
              }}
              placeholder="your@email.com"
              className="input-glass flex-1"
              disabled={status === 'loading' || status === 'success'}
              required
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !email.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Sending...' : status === 'success' ? 'Done ✓' : 'Notify Me'}
            </button>
          </div>

          {status === 'success' && (
            <p className="text-center text-sm text-green-400">{message}</p>
          )}
          {status === 'error' && (
            <p className="text-center text-sm text-red-400">{message}</p>
          )}
        </form>

        <p className="text-center text-xs text-slate-500">
          No spam. We&apos;ll only email you once — when the service is ready.
        </p>

        {status !== 'success' && (
          <div className="text-center">
            <button
              onClick={handleClose}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
