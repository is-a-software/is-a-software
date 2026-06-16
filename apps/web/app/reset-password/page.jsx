'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBanner from '@/components/ErrorBanner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      router.push('/signin');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successMessage, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!token) {
      setError('Invalid or missing reset token. Please use the link from your email.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New Password and Confirm Password must match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1/api'}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        })
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to reset password. Please try again.');
      }

      setSuccessMessage(data?.message || 'Password updated successfully. Redirecting to Sign In...');
      setFormData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-96px)] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-300">Set a new password for your account.</p>
        </div>

        <div className="glass rounded-2xl shadow-xl p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner error={error} />

            {!error && successMessage && (
              <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-200">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-glass"
                disabled={isLoading || !!successMessage}
                required
                minLength={8}
                autoFocus
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
                disabled={isLoading || !!successMessage}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !!successMessage}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <div className="text-center">
            <Link href="/signin" className="text-slate-400 hover:text-white text-sm transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main className="min-h-[calc(100vh-96px)] flex items-center justify-center px-4 py-10">
          <div className="max-w-md w-full mx-auto text-center text-slate-400">
            Loading...
          </div>
        </main>
      }>
        <ResetPasswordForm />
      </Suspense>
      <Footer />
    </>
  );
}
