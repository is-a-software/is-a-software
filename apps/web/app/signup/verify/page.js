'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBanner from '@/components/ErrorBanner';
import { authApi } from '@/lib/api';
import { useWaitlist } from '@/lib/waitlist';

const SIGNUP_PENDING_KEY = 'pending_signup_verification';

export default function VerifySignupPage() {
  const router = useRouter();
  const { openWaitlist } = useWaitlist();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pendingSignup, setPendingSignup] = useState(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(SIGNUP_PENDING_KEY);
      if (!raw) {
        setPendingSignup(null);
        setEmail('');
        setError('Signup session expired. Please start again.');
        return;
      }

      const pending = JSON.parse(raw);
      if (!pending?.name || !pending?.email || !pending?.password) {
        setPendingSignup(null);
        setEmail('');
        setError('Signup session expired. Please start again.');
        return;
      }

      const normalizedPending = {
        name: String(pending.name).trim(),
        email: String(pending.email).trim().toLowerCase(),
        password: String(pending.password)
      };

      setPendingSignup(normalizedPending);
      setEmail(normalizedPending.email);
      setError('');
    } catch {
      setPendingSignup(null);
      setEmail('');
      setError('Signup session expired. Please start again.');
    }
  }, []);

  const handleNotYourEmail = () => {
    try {
      window.sessionStorage.removeItem(SIGNUP_PENDING_KEY);
    } catch {
      // ignore sessionStorage errors
    }
    router.push('/signup');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!pendingSignup?.email) {
      setError('Signup session expired. Please start again.');
      return;
    }

    if (!otp.trim()) {
      setError('Enter the OTP sent to your email.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.verifySignupOtp(pendingSignup.email, otp.trim());
      window.sessionStorage.removeItem(SIGNUP_PENDING_KEY);
      setMessage(result?.message || 'Email verified successfully. Redirecting to sign in...');
      setTimeout(() => {
        router.push('/signin');
      }, 1200);
    } catch (err) {
      openWaitlist();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');

    try {
      const raw = window.sessionStorage.getItem(SIGNUP_PENDING_KEY);
      if (!raw) {
        setError('Signup details expired. Please start again.');
        return;
      }

      const pending = JSON.parse(raw);
      if (!pending?.name || !pending?.email || !pending?.password) {
        setError('Signup details expired. Please start again.');
        return;
      }

      setIsResending(true);
      const result = await authApi.requestSignupOtp(pending.name, pending.email, pending.password);
      const devHint = result?.otpDev ? ` (Dev OTP: ${result.otpDev})` : '';
      setMessage((result?.message || 'OTP resent successfully.') + devHint);
    } catch (err) {
      openWaitlist();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-20">
        <div className="max-w-lg w-full glass rounded-2xl p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-white">Verify Your Email</h1>
            <p className="text-slate-300">
              Enter the OTP sent to <span className="text-white">{email || 'your email'}</span> to complete signup.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <ErrorBanner error={error} />
            {!error && message && (
              <div className="glass rounded-2xl p-4 status-good text-sm">{message}</div>
            )}

            <div className="space-y-2">
              <label htmlFor="signupOtp" className="block text-sm font-medium text-slate-200">
                OTP Code
              </label>
              <input
                id="signupOtp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-glass"
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                maxLength={6}
                disabled={isLoading || isResending}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isResending}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Verifying OTP...' : 'Verify & Create Account'}
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading || isResending || !pendingSignup}
              className="text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {isResending ? 'Resending OTP...' : 'Resend OTP'}
            </button>

            <button
              type="button"
              onClick={handleNotYourEmail}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Not your email?
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
