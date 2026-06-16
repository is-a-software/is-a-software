'use client';

import { useState } from 'react';

export default function StatusCard() {
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
        setMessage('You\'re on the list! We\'ll let you know when we\'re live.');
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

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-3xl p-8 md:p-12 space-y-8">
          <div className="space-y-2 text-center">
            <div className="inline-block px-3 py-1 bg-white/6 border border-white/12 rounded-full text-sm text-slate-300 mb-2">
              Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Dashboard Under Construction
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              We&apos;re migrating to a new backend. Domain registration and management
              will be available soon. Leave your email and we&apos;ll notify you the moment
              we&apos;re live.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
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
                disabled={status === 'loading'}
                required
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === 'loading' ? 'Sending...' : 'Notify Me'}
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
        </div>
      </div>
    </section>
  );
}
