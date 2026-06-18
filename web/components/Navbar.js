'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, getUser, logout, readSessionCache, writeSessionCache } from '@/lib/auth';
import { userApi } from '@/lib/api';
import { useAccountLimits } from '@/lib/hooks/useAccountLimits';
import { useUnauthorizedRedirect } from '@/lib/hooks/useUnauthorizedRedirect';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/docs', label: 'Docs' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const router = useRouter();
  const handleUnauthorized = useUnauthorizedRedirect();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { refreshLimits } = useAccountLimits({
    enabled: false,
    onUnauthorized: handleUnauthorized
  });
  const initial = (displayName?.trim()?.[0] || 'A').toUpperCase();

  useEffect(() => {
    const loadSession = async () => {
      const token = getToken();
      const user = readSessionCache('me', 5 * 60_000) || getUser();
      setIsLoggedIn(!!token);
      setDisplayName(user?.name || 'Account');

      if (!token) {
        setIsPremium(false);
        return;
      }

      try {
        const limits = await refreshLimits();
        setIsPremium(!!limits?.premium);

        if (!user?.name) {
          const me = await userApi.getMe();
          writeSessionCache('me', me);
          setDisplayName(me.name);
        }
      } catch {
        setIsPremium(false);
      }
    };

    loadSession();
  }, [refreshLimits]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const handleSignOut = () => {
    logout();
    setIsLoggedIn(false);
    setIsPremium(false);
    setDisplayName('');
    setIsOpen(false);
    router.push('/signin');
  };

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className="sticky top-0 z-50 mx-4 mt-4 rounded-2xl transition-all duration-300"
      style={{
        background: scrolled
          ? 'linear-gradient(180deg, rgba(14,14,14,0.92), rgba(8,8,8,0.82))'
          : 'linear-gradient(180deg, rgba(18,18,18,0.82), rgba(10,10,10,0.66))',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled
          ? '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset'
          : '0 20px 60px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-[1.2rem] font-semibold tracking-tight"
          style={{ color: '#f1f5f9' }}
        >
          is-a.<span style={{ color: 'rgba(255,255,255,0.55)' }}>software</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150"
                style={{
                  color: active ? '#f8fafc' : 'rgba(203,213,225,0.75)',
                  background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(203,213,225,0.75)'; e.currentTarget.style.background = 'transparent'; } }}
              >
                {label}
                {active && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                href="/settings"
                aria-label="Settings"
                title={displayName}
                className="h-8 w-8 rounded-full text-white text-sm font-semibold inline-flex items-center justify-center shrink-0 transition-all duration-150"
                style={{
                  border: isPremium ? '1px solid transparent' : '1px solid rgba(255,255,255,0.18)',
                  backgroundImage: isPremium
                    ? 'linear-gradient(180deg, rgba(18,18,18,0.9), rgba(10,10,10,0.78)), linear-gradient(135deg, #f59e0b, #f472b6 45%, #60a5fa)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
                  backgroundOrigin: isPremium ? 'border-box' : undefined,
                  backgroundClip: isPremium ? 'padding-box, border-box' : undefined,
                  boxShadow: '0 0 0 0px rgba(255,255,255,0)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = isPremium ? '0 0 0 2px rgba(251,191,36,0.35)' : '0 0 0 2px rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 0px rgba(255,255,255,0)'; }}
              >
                {initial}
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150"
                style={{
                  color: 'rgba(203,213,225,0.75)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(203,213,225,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150"
              style={{
                background: 'linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 100%)',
                color: '#0a0a0a',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 100%)'; }}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 rounded-lg transition-colors"
          style={{ color: '#94a3b8' }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color: active ? '#f8fafc' : 'rgba(203,213,225,0.75)',
                    background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div
            className="mt-3 pt-3 flex flex-col gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            {isLoggedIn ? (
              <>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: 'rgba(203,213,225,0.75)', background: 'transparent' }}
                >
                  <span
                    className="h-7 w-7 rounded-full text-white text-xs font-semibold inline-flex items-center justify-center shrink-0"
                    style={{
                      border: isPremium ? '1px solid transparent' : '1px solid rgba(255,255,255,0.18)',
                      backgroundImage: isPremium
                        ? 'linear-gradient(180deg, rgba(18,18,18,0.9), rgba(10,10,10,0.78)), linear-gradient(135deg, #f59e0b, #f472b6 45%, #60a5fa)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
                      backgroundOrigin: isPremium ? 'border-box' : undefined,
                      backgroundClip: isPremium ? 'padding-box, border-box' : undefined,
                    }}
                  >
                    {initial}
                  </span>
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium w-full"
                  style={{
                    color: 'rgba(203,213,225,0.75)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 100%)', color: '#0a0a0a' }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
