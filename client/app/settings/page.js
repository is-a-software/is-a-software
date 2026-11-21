'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUser, readSessionCache, setUser as setStoredUser, writeSessionCache } from '@/lib/auth';
import { userApi } from '@/lib/api';
import ErrorBanner from '@/components/ErrorBanner';
import ProtectedPageLoader from '@/components/ProtectedPageLoader';
import RecordLimitSummary from '@/components/RecordLimitSummary';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { useAccountLimits } from '@/lib/hooks/useAccountLimits';

export default function SettingsPage() {
  const { isAuthed, isCheckingAuth } = useRequireAuth();
  const [user, setLocalUser] = useState(null);
  const { limits } = useAccountLimits({ enabled: isAuthed });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    if (!isAuthed) return;

    const loadUser = async () => {
      const localUser = readSessionCache('me', 5 * 60_000) || getUser();
      setLocalUser(localUser);

      if (!localUser?.email) {
        try {
          const me = await userApi.getMe();
          setLocalUser(me);
          setStoredUser({ name: me?.name || '', email: me?.email || '' });
          writeSessionCache('me', me);
        } catch {
          // keep whatever is stored locally
        }
      }
    };

    loadUser();
  }, [isAuthed]);

  if (isCheckingAuth || !isAuthed) {
    return <ProtectedPageLoader message="Loading settings..." />;
  }

  const startEditingName = () => {
    setNameDraft(user?.name || '');
    setIsEditingName(true);
    setProfileError('');
    setProfileSuccess('');
  };

  const saveName = async () => {
    const value = nameDraft.trim();
    setProfileError('');
    setProfileSuccess('');
    if (!value) {
      setProfileError('Name cannot be empty.');
      return;
    }

    setIsSavingName(true);
    try {
      const result = await userApi.updateProfile({ name: value });
      const nextUser = { ...(user || {}), name: result?.data?.updatedName ?? value };
      setLocalUser(nextUser);
      setStoredUser(nextUser);
      writeSessionCache('me', nextUser);
      setIsEditingName(false);
      setProfileSuccess(result?.message || 'Name updated successfully.');
    } catch (err) {
      setProfileError(err.message || 'Failed to update name.');
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">

          <section className="glass rounded-3xl p-8 md:p-10 space-y-3">
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-slate-300">Manage your account preferences.</p>
          </section>

          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Account</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Name</p>
                {isEditingName ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      className="input-glass max-w-sm h-9"
                      placeholder="Your name"
                      aria-label="Name"
                      autoFocus
                    />
                    <button type="button" onClick={saveName} disabled={isSavingName} className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50">
                      {isSavingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingName(false);
                        setProfileError('');
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
                      onClick={startEditingName}
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
                <p className="text-white font-medium">{user?.email || '—'}</p>
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

          <section className="glass rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Limits</h2>
            <RecordLimitSummary limits={limits} />
            <p className="text-xs text-slate-500">
              Every account can have as many subdomains as it likes, with {limits.recordLimit || 3} DNS records in total across them.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
