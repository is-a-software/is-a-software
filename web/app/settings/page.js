'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUser, readSessionCache, setUser as setStoredUser, writeSessionCache } from '@/lib/auth';
import { authApi, userApi } from '@/lib/api';
import ErrorBanner from '@/components/ErrorBanner';
import ProtectedPageLoader from '@/components/ProtectedPageLoader';
import StatusBadge from '@/components/StatusBadge';
import RecordLimitSummary from '@/components/RecordLimitSummary';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { useAccountLimits } from '@/lib/hooks/useAccountLimits';

export default function SettingsPage() {
  const { isAuthed, isCheckingAuth } = useRequireAuth();
  const [user, setLocalUser] = useState(null);
  const { limits } = useAccountLimits({ enabled: isAuthed });
  const [profileEdit, setProfileEdit] = useState({ name: false, email: false });
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);

  // Change password state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthed) return;

    const loadUser = async () => {
      const localUser = readSessionCache('me', 5 * 60_000) || getUser();
      setLocalUser(localUser);
      setProfileForm({
        name: localUser?.name || '',
        email: localUser?.email || ''
      });

      if (!localUser?.name || !localUser?.email) {
        try {
          const me = await userApi.getMe();
          setLocalUser(me);
          setStoredUser({ name: me?.name || '', email: me?.email || '' });
          writeSessionCache('me', me);
          setProfileForm({
            name: me?.name || '',
            email: me?.email || ''
          });
        } catch {
          // fall back to stored user while mock backend remains minimal
        }
      }
    };

    loadUser();
  }, [isAuthed]);

  if (isCheckingAuth || !isAuthed) {
    return <ProtectedPageLoader message="Loading settings..." />;
  }

  const handleProfileFieldChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setProfileError('');
    setProfileSuccess('');
  };

  const applyUserUpdate = (apiResponse, fallback = {}) => {
    const updatedUser = apiResponse?.user || apiResponse?.userDto || apiResponse || {};

    const nextUser = {
      ...(user || {}),
      ...(updatedUser || {}),
      name: updatedUser?.name ?? fallback.name ?? user?.name ?? '',
      email: updatedUser?.email ?? fallback.email ?? user?.email ?? ''
    };

    setLocalUser(nextUser);
    setStoredUser(nextUser);
    writeSessionCache('me', nextUser);
    setProfileForm({
      name: nextUser.name || '',
      email: nextUser.email || ''
    });
  };

  const saveProfileField = async (field) => {
    setProfileError('');
    setProfileSuccess('');

    const rawValue = String(profileForm[field] || '');
    const value = field === 'email' ? rawValue.trim().toLowerCase() : rawValue.trim();

    if (!value) {
      setProfileError(`${field === 'name' ? 'Name' : 'Email'} cannot be empty.`);
      return;
    }

    if (field === 'email') {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!validEmail) {
        setProfileError('Enter a valid email address.');
        return;
      }

      if (!emailCurrentPassword.trim()) {
        setProfileError('Enter your current password to request email update OTP.');
        return;
      }
    }

    if (field === 'email') {
      if (value === String(user?.email || '').toLowerCase()) {
        setProfileEdit((prev) => ({ ...prev, email: false }));
        setProfileSuccess('Email unchanged.');
        return;
      }

      setIsSendingEmailOtp(true);
      try {
        const result = await userApi.requestEmailUpdateOtp(value, emailCurrentPassword.trim());
        setPendingEmail(value);
        setEmailOtpSent(true);
        setEmailOtpCode('');
        setProfileSuccess(result?.message || 'OTP sent to your new email. Enter OTP to confirm update.');
      } catch (err) {
        if (err?.status === 404) {
          setProfileError('Email update OTP endpoint is not available yet. Add backend route POST /v1/api/user/email/request-otp.');
        } else {
          setProfileError(err.message || 'Failed to send OTP for email update.');
        }
      } finally {
        setIsSendingEmailOtp(false);
      }
      return;
    }

    setIsSavingName(true);
    try {
      const result = await userApi.updateProfile({ name: value });
      applyUserUpdate(result, { name: value });
      setProfileEdit((prev) => ({ ...prev, name: false }));
      setProfileSuccess(result?.message || 'Name updated successfully.');
    } catch (err) {
      if (err?.status === 404) {
        setProfileError('Profile update endpoint is not available yet. Add backend route PUT /v1/api/user/profile.');
      } else {
        setProfileError(err.message || 'Failed to update name.');
      }
    } finally {
      setIsSavingName(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setProfileError('');

    if (!emailOtpCode.trim()) {
      setProfileError('Enter OTP to update email.');
      return;
    }

    setIsVerifyingEmailOtp(true);
    try {
      const result = await userApi.verifyEmailUpdateOtp(pendingEmail, emailOtpCode.trim());
      applyUserUpdate(result, { email: pendingEmail });
      setProfileEdit((prev) => ({ ...prev, email: false }));
      setEmailOtpSent(false);
      setEmailOtpCode('');
      setEmailCurrentPassword('');
      setPendingEmail('');
      setProfileSuccess(result?.message || 'Email updated successfully.');
    } catch (err) {
      if (err?.status === 404) {
        setProfileError('Email verification endpoint is not available yet. Add backend route POST /v1/api/user/email/verify-otp.');
      } else {
        setProfileError(err.message || 'Failed to verify OTP for email update.');
      }
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
    setPwError('');
    setPwSuccess(false);
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    setPwLoading(true);
    try {
      await authApi.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <section className="glass rounded-3xl p-8 md:p-10 space-y-3">
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-slate-300">Manage your account preferences.</p>
          </section>

          {/* Profile info */}
          <section
            className="glass rounded-2xl p-6 space-y-4"
            style={limits.premium ? {
              border: '1px solid transparent',
              backgroundImage:
                'linear-gradient(180deg, rgba(18,18,18,0.84), rgba(10,10,10,0.7)), linear-gradient(135deg, #f59e0b, #f472b6 45%, #60a5fa)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 0 0 1px rgba(251,191,36,0.18), 0 18px 45px rgba(0,0,0,0.45), 0 0 26px rgba(244,114,182,0.12)'
            } : undefined}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Account</h2>
              {limits.premium && (
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wider"
                  style={{
                    color: '#fde68a',
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(244,114,182,0.16))',
                    border: '1px solid rgba(251,191,36,0.35)'
                  }}
                >
                  PREMIUM
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Name</p>
                {profileEdit.name ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={profileForm.name}
                      onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                      className="input-glass max-w-sm h-9"
                      placeholder="Your name"
                      autoFocus
                    />
                    <button type="button" onClick={() => saveProfileField('name')} disabled={isSavingName} className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50">
                      {isSavingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileEdit((prev) => ({ ...prev, name: false }));
                        setProfileForm((prev) => ({ ...prev, name: user?.name || '' }));
                        setProfileError('');
                        setProfileSuccess('');
                      }}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{user?.name || '—'}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileEdit((prev) => ({ ...prev, name: true }));
                        setProfileForm((prev) => ({ ...prev, name: user?.name || '' }));
                        setProfileError('');
                        setProfileSuccess('');
                      }}
                      className="inline-flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      title="Edit name"
                      aria-label="Edit name"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Email</p>
                {profileEdit.email ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                        className="input-glass max-w-sm h-9"
                        placeholder="you@example.com"
                        autoFocus
                      />

                      <input
                        type="password"
                        value={emailCurrentPassword}
                        onChange={(e) => setEmailCurrentPassword(e.target.value)}
                        className="input-glass max-w-sm h-9"
                        placeholder="Current password"
                        autoComplete="current-password"
                      />

                      <button type="button" onClick={() => saveProfileField('email')} disabled={isSendingEmailOtp} className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50">
                        {isSendingEmailOtp ? 'Sending...' : 'Send OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileEdit((prev) => ({ ...prev, email: false }));
                          setProfileForm((prev) => ({ ...prev, email: user?.email || '' }));
                          setProfileError('');
                          setProfileSuccess('');
                          setEmailOtpSent(false);
                          setEmailOtpCode('');
                          setEmailCurrentPassword('');
                          setPendingEmail('');
                        }}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>

                    {emailOtpSent && (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          value={emailOtpCode}
                          onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="input-glass max-w-35 h-9 tracking-[0.2em]"
                          placeholder="OTP"
                          inputMode="numeric"
                        />
                        <button type="button" onClick={handleVerifyEmailOtp} disabled={isVerifyingEmailOtp} className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50">
                          {isVerifyingEmailOtp ? 'Verifying...' : 'Verify OTP & Update'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{user?.email || '—'}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileEdit((prev) => ({ ...prev, email: true }));
                        setProfileForm((prev) => ({ ...prev, email: user?.email || '' }));
                        setProfileError('');
                        setProfileSuccess('');
                      }}
                      className="inline-flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      title="Edit email"
                      aria-label="Edit email"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {profileError && <ErrorBanner error={profileError} />}
            {!profileError && profileSuccess && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#86efac' }}
              >
                {profileSuccess}
              </div>
            )}
          </section>

          {/* Add-ons & Limits */}
          <section className="glass rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Add-ons &amp; Limits</h2>

            <RecordLimitSummary limits={limits} compact />

            {/* Premium add-on */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">Premium Plan</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {limits.premium ? 'Active — +50 DNS records included' : 'Unlock +50 DNS records'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge active={limits.premium} />
                <Link href="/subscriptions" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Upgrade Your Plan (Manage Subscription)
                </Link>
              </div>
            </div>

            {/* GitHub Star bonus */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">GitHub Star Bonus</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {limits.githubBonus ? 'Active — +3 DNS records included' : 'Verify your GitHub star for +3 DNS records'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge active={limits.githubBonus} />
                <Link href="/github" className="text-xs text-slate-400 hover:text-white transition-colors">
                  {limits.githubBonus ? 'Manage →' : 'Verify →'}
                </Link>
              </div>
            </div>
          </section>

          {/* Change password */}
          <section className="glass rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Change Password</h2>

            <form onSubmit={handlePwSubmit} className="space-y-4">
              <ErrorBanner error={pwError} />
              {pwSuccess && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#86efac' }}
                >
                  Password changed successfully.
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300">
                    Current password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={pwForm.currentPassword}
                  onChange={handlePwChange}
                  placeholder="••••••••"
                  className="input-glass"
                  disabled={pwLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={pwForm.newPassword}
                  onChange={handlePwChange}
                  placeholder="Min. 8 characters"
                  className="input-glass"
                  disabled={pwLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={pwForm.confirmPassword}
                  onChange={handlePwChange}
                  placeholder="••••••••"
                  className="input-glass"
                  disabled={pwLoading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                className="btn-primary disabled:opacity-50"
              >
                {pwLoading ? 'Saving...' : 'Update password'}
              </button>
            </form>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
