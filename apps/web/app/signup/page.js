'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBanner from '@/components/ErrorBanner';
import { authApi } from '@/lib/api';
import { useWaitlist } from '@/lib/waitlist';

const SIGNUP_PENDING_KEY = 'pending_signup_verification';

export default function SignUp() {
  const router = useRouter();
  const { openWaitlist } = useWaitlist();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authApi.requestSignupOtp(name, email, password);

      window.sessionStorage.setItem(
        SIGNUP_PENDING_KEY,
        JSON.stringify({ name, email, password })
      );

      setMessage(result?.message || 'OTP sent. Redirecting to verification...');
      router.push('/signup/verify');
    } catch (err) {
      openWaitlist();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-96px)] flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">Create Account</h1>
            <p className="text-slate-300">Join is-a.software and claim your domain</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner error={error} />
            {!error && message && (
              <div className="glass rounded-2xl p-4 status-good text-sm">{message}</div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-glass"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-glass"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-glass"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-glass"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Sending OTP...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link href="/signin" className="accent-ice hover:text-white">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
