'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBanner from '@/components/ErrorBanner';
import ProtectedPageLoader from '@/components/ProtectedPageLoader';
import { githubApi } from '@/lib/api';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

export default function GithubVerifyPage() {
  const router = useRouter();
  const { isAuthed, isCheckingAuth } = useRequireAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isOAuthStarting, setIsOAuthStarting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Not verified yet');
  const [bonusActive, setBonusActive] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load GitHub status from backend
  const loadGitHubStatus = async (showSuccess = false) => {
    setIsLoading(true);
    try {
      const status = await githubApi.getStatus();
      console.log('GitHub Status from backend:', status);
      
      const connected = status.connected;
      const starred = status.starred;
      
      setIsConnected(connected);
      setUsername(status.username || '');
      setBonusActive(starred);
      
      if (connected && starred) {
        setVerificationStatus('Verified ✓');
        if (showSuccess) {
          setShowSuccessMessage(true);
          setMessage('✓ GitHub connected and star verified! Bonus is active.');
          setTimeout(() => setShowSuccessMessage(false), 5000);
        }
      } else if (connected) {
        setVerificationStatus('Connected, star not verified');
        if (showSuccess) {
          setShowSuccessMessage(true);
          setMessage('✓ GitHub connected! Please star the repository and click Reconnect GitHub.');
          setTimeout(() => setShowSuccessMessage(false), 5000);
        }
      } else {
        setVerificationStatus('Not connected');
        setMessage('');
      }
      
    } catch (err) {
      console.error('Failed to load GitHub status:', err);
      setError(err.message || 'Failed to load GitHub status.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for callback data on page load
  useEffect(() => {
    if (!isAuthed) return;

    const checkCallbackData = async () => {
      try {
        const raw = localStorage.getItem('githubAuthState');
        if (raw) {
          const state = JSON.parse(raw);
          const now = Date.now();
          
          if (now - state.timestamp < 5 * 60 * 1000) {
            console.log('Callback data found:', state);
            
            if (state.authenticated) {
              await loadGitHubStatus(true);
            }
          }
          localStorage.removeItem('githubAuthState');
        } else {
          await loadGitHubStatus(false);
        }
      } catch (err) {
        console.error('Failed to read GitHub state:', err);
        await loadGitHubStatus(false);
      }
    };

    checkCallbackData();
  }, [isAuthed]);

  const handleGitHubAuth = async () => {
    setError('');
    setMessage('');
    setShowSuccessMessage(false);
    setIsOAuthStarting(true);

    try {
      const redirectUri = `${window.location.origin}/github/callback`;
      const authUrl = githubApi.startAuthUrl(redirectUri, 'connect');
      window.location.href = authUrl;
    } catch (err) {
      setIsOAuthStarting(false);
      setError('Unable to start GitHub authentication. Please try again.');
    }
  };

  if (isCheckingAuth || !isAuthed) {
    return <ProtectedPageLoader message="Loading GitHub verification..." />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <section className="glass rounded-3xl p-8 md:p-10 space-y-3">
            <h1 className="text-4xl font-bold text-white">GitHub Star Verification</h1>
            <p className="text-slate-300">
              Connect your GitHub account and star our repository to unlock bonus features (+3 records).
            </p>
          </section>

          <section className="glass rounded-2xl p-6 space-y-4">
            <ErrorBanner error={error} />
            
            {showSuccessMessage && message && (
              <div className="p-4 rounded-xl text-sm bg-green-500/20 text-green-300 border border-green-500/30 animate-pulse">
                {message}
              </div>
            )}
            
            {!showSuccessMessage && message && (
              <div className="p-4 rounded-xl text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {message}
              </div>
            )}

            <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">GitHub Connection</h2>
              <p className="text-sm text-slate-400">
                Step 1: Connect with GitHub. Step 2: Star the repository. Step 3: Click Reconnect to verify.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                {/* Connect Button - Disabled if already connected */}
                <button
                  type="button"
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    isConnected 
                      ? 'bg-green-600/50 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  }`}
                  onClick={handleGitHubAuth}
                  disabled={isOAuthStarting || isLoading || isConnected}
                >
                  {isOAuthStarting ? 'Redirecting...' : isConnected ? '✓ Connected' : '🔗 Connect GitHub'}
                </button>

                {/* Reconnect Button - Shows always when connected */}
                {isConnected && (
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-xl font-medium transition-all text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                    onClick={handleGitHubAuth}
                    disabled={isOAuthStarting}
                  >
                    {isOAuthStarting ? 'Redirecting...' : '🔄 Reconnect GitHub'}
                  </button>
                )}
              </div>
              
              {/* Status indicators */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className="text-slate-400">
                    {isConnected ? 'GitHub account connected' : 'No GitHub account connected'}
                  </span>
                </div>
                {isConnected && (
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${bonusActive ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                    <span className="text-slate-400">
                      {bonusActive ? 'Bonus active (+3 records)' : 'Star verification pending - Click Reconnect GitHub after starring'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="glass rounded-2xl p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-white">Status</h2>
            <div className="space-y-2">
              <p className="text-slate-300">
                GitHub Username: <span className="text-white font-medium">{username || '—'}</span>
              </p>
              <p className="text-slate-300">
                Connection Status: 
                <span className={`ml-2 font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {isConnected ? '✓ Connected' : '✗ Not connected'}
                </span>
              </p>
              <p className="text-slate-300">
                Verification Status: 
                <span className={`ml-2 font-medium ${
                  verificationStatus === 'Verified ✓' ? 'text-green-400' : 
                  verificationStatus === 'Connected, star not verified' ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {verificationStatus}
                </span>
              </p>
              <p className="text-slate-300">
                Bonus Status: 
                <span className={`ml-2 font-medium ${bonusActive ? 'text-green-400' : 'text-gray-400'}`}>
                  {bonusActive ? '✓ Active (+3 records)' : 'Inactive'}
                </span>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}