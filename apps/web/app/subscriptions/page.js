'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBanner from '@/components/ErrorBanner';
import ProtectedPageLoader from '@/components/ProtectedPageLoader';
import { readSessionCache, writeSessionCache } from '@/lib/auth';
import { premiumApi, userApi } from '@/lib/api';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { useAccountLimits } from '@/lib/hooks/useAccountLimits';
import { useUnauthorizedRedirect } from '@/lib/hooks/useUnauthorizedRedirect';

const PLAN_KEYS = {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
  PREMIUM_PLUS: 'PREMIUM_PLUS'
};

export default function SubscriptionsPage() {
  const searchParams = useSearchParams();
  const handleUnauthorized = useUnauthorizedRedirect();
  const { isAuthed, isCheckingAuth } = useRequireAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [subscription, setSubscription] = useState({});
  const { setLimits, refreshLimits } = useAccountLimits({
    enabled: false,
    onUnauthorized: handleUnauthorized
  });

  const [isIndia, setIsIndia] = useState(true);

  const loadRazorpayScript = () => {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (window.Razorpay) return Promise.resolve(true);

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const COUNTRY_CACHE_TTL_MS = 5 * 60_000;
    const cachedCountryCode = readSessionCache('country-code', COUNTRY_CACHE_TTL_MS, 'global');
    if (cachedCountryCode) {
      setIsIndia(cachedCountryCode === 'IN');
    }

    const resolveCountryCode = async () => {
      const tryIpApi = async () => {
        const res = await fetch('https://ipapi.co/country_code/', { cache: 'no-store' });
        if (!res.ok) throw new Error('ipapifailed');
        return (await res.text()).trim().toUpperCase();
      };

      const tryIpWho = async () => {
        const res = await fetch('https://ipwho.is/', { cache: 'no-store' });
        if (!res.ok) throw new Error('ipwhofailed');
        const data = await res.json();
        return String(data?.country_code || '').trim().toUpperCase();
      };

      try {
        return await tryIpApi();
      } catch {
        try {
          return await tryIpWho();
        } catch {
          return '';
        }
      }
    };

    resolveCountryCode()
      .then((code) => {
        if (!code) return;
        writeSessionCache('country-code', code, 'global');
        setIsIndia(code === 'IN');
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthed) return;

    const loadPageData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const cachedSubscription = readSessionCache('subscription', 60_000);
        const [subscriptionRes, limitsRes] = await Promise.all([
          cachedSubscription ? Promise.resolve(cachedSubscription) : userApi.getSubscription(),
          refreshLimits()
        ]);

        setSubscription(subscriptionRes || {});
        writeSessionCache('subscription', subscriptionRes || {});
        setLimits({
          recordsUsed: limitsRes?.recordsUsed ?? 0,
          recordLimit: limitsRes?.recordLimit ?? 0,
          githubBonus: !!limitsRes?.githubBonus,
          premium: !!limitsRes?.premium
        });
      } catch (err) {
        setError(err.message || 'Failed to load subscription details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [isAuthed, refreshLimits, setLimits]);

  useEffect(() => {
    const status = searchParams.get('checkout');
    if (status === 'cancel') {
      setMessage('Payment was cancelled. You can try again anytime.');
      setError('');
      return;
    }

    if (status === 'failed') {
      setError('Payment failed. Please try again.');
      setMessage('');
    }
  }, [searchParams]);

  const subscriptionPlan = String(subscription?.plan || '').toUpperCase();
  const subscriptionStatus = String(subscription?.status || '').toUpperCase();
  const currentPlan = subscriptionStatus === 'ACTIVE' && subscriptionPlan
    ? subscriptionPlan
    : PLAN_KEYS.FREE;

  const plans = [
    {
      key: PLAN_KEYS.FREE,
      name: 'Free',
      subtitle: 'Keep building with essential access',
      price: 'Free Forever',
      featured: false,
      highlights: [
        'A, CNAME, AAAA, TXT Records',
        '2 Domains',
        '5 Records (10 with GitHub)'
      ]
    },
    {
      key: PLAN_KEYS.PREMIUM,
      name: 'Premium',
      subtitle: 'Unlock more DNS capacity',
      price: '₹79',      // Hardcoded INR price
      featured: true,
      highlights: [
        'Everything in Free',
        '10 Domains',
        '50 Subdomains',
        'MX Records'
      ]
    },
    {
      key: PLAN_KEYS.PREMIUM_PLUS,
      name: 'Premium+',
      subtitle: 'Scale for larger projects',
      price: '₹129',     // Hardcoded INR price
      featured: false,
      highlights: [
        'Everything in Premium',
        '20 Domains',
        '100 Subdomains',
        'NS Records'
      ]
    }
  ];

  const handlePlanAction = async (planKey) => {
    setError('');
    setMessage('');

    if (planKey === PLAN_KEYS.FREE) {
      setMessage('You are already on Free.');
      return;
    }

    setIsSubmittingPlan(planKey);
    try {
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        throw new Error('Unable to load Razorpay checkout. Please retry.');
      }

      const currency = 'INR';  // Force INR only
      const checkout = await premiumApi.startCheckout(planKey, currency);
      if (!checkout?.keyId || !checkout?.subscriptionId) {
        throw new Error('Payment session is invalid. Please try again.');
      }

      const razorpay = new window.Razorpay({
        key: checkout?.keyId,
        subscription_id: checkout?.subscriptionId,
        name: checkout?.name || 'is-a.software',
        description: checkout?.description || 'Subscription payment',
        prefill: {
          email: checkout?.email || ''
        },
        retry: {
          enabled: true,
          max_count: 1
        },
        timeout: 300,
        remember_customer: false,
        theme: {
          color: '#0f172a'
        },
        modal: {
          ondismiss: () => {
            setMessage('Payment window closed. Your subscription was not changed.');
            setIsSubmittingPlan('');
          }
        },
        handler: async (response) => {
          try {
            const subscriptionId = response?.razorpay_subscription_id;
            const paymentId = response?.razorpay_payment_id;
            const signature = response?.razorpay_signature;

            if (!subscriptionId || !paymentId || !signature) {
              throw new Error('Payment response is incomplete. Please try again.');
            }

            const confirmRes = await premiumApi.confirmCheckout({
              plan: planKey,
              currency,
              subscriptionId,
              paymentId,
              signature
            });

            const refreshedSubscription = confirmRes?.subscription || await userApi.getSubscription();
            const limitsRes = await refreshLimits();
            setSubscription(refreshedSubscription || {});
            writeSessionCache('subscription', refreshedSubscription || {});
            setLimits({
              recordsUsed: limitsRes?.recordsUsed ?? 0,
              recordLimit: limitsRes?.recordLimit ?? 0,
              githubBonus: !!limitsRes?.githubBonus,
              premium: !!limitsRes?.premium
            });
            setError('');
            setMessage(confirmRes?.message || 'Payment successful. Subscription updated.');
          } catch (confirmErr) {
            if (confirmErr.status === 401) return;
            setError(confirmErr.message || 'Payment succeeded but verification failed. Contact support.');
          } finally {
            setIsSubmittingPlan('');
          }
        }
      });

      razorpay.on('payment.failed', (failure) => {
        const failureMessage = failure?.error?.description || 'Payment failed. Please try again.';
        setError(failureMessage);
        setMessage('');
        setIsSubmittingPlan('');
      });

      razorpay.open();
      return;
    } catch (err) {
      if (err.status === 401) return;
      if (err.message === '__BACKEND_DOWN__') {
        setError('Backend is unavailable right now. Please try again in a moment.');
      } else {
        setError(err.message || 'Failed to start checkout.');
      }
      setIsSubmittingPlan('');
    }
  };

  if (isCheckingAuth || !isAuthed){
    return <ProtectedPageLoader message="Loading subscription details..." />;
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden px-4 pt-24 pb-12 md:pb-14">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[20rem] w-[34rem] -translate-x-1/2 rounded-full blur-3xl opacity-35" style={{ background: 'radial-gradient(circle, rgba(148,163,184,0.22), rgba(0,0,0,0) 70%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Subscriptions</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-white">Choose your plan</h1>
            <p className="text-slate-400 text-sm">Current plan: <span className="text-slate-200 font-medium">{currentPlan.replace('_', ' ')}</span></p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
              <span>Pricing:</span>
              <span className="text-slate-200">India (INR)</span>
            </div>
          </div>

          <ErrorBanner error={error} />
          {!error && message && (
            <div className="glass rounded-2xl p-4 status-good text-sm">{message}</div>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.key;
              const isPremiumTier = plan.featured;
              const currencySymbol = plan.price.startsWith('₹') ? '₹' : '';
              const plainPrice = plan.price.replace(/[^0-9]/g, '');

              return (
                <article
                  key={plan.key}
                  className="relative rounded-3xl p-6 md:p-7 flex flex-col"
                  style={{
                    border: isPremiumTier
                      ? '1px solid rgba(255,255,255,0.2)'
                      : '1px solid rgba(255,255,255,0.1)',
                    background: 'linear-gradient(180deg, rgba(24,24,27,0.86), rgba(12,12,14,0.92))',
                    boxShadow: isPremiumTier
                      ? '0 24px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset'
                      : '0 20px 40px rgba(0,0,0,0.35)'
                  }}
                >
                  {isPremiumTier && (
                    <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] tracking-wider font-semibold text-slate-100 uppercase">
                      Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-4xl font-semibold text-white tracking-tight">{plan.name}</h2>
                      <p className="text-slate-300 text-lg leading-snug">{plan.subtitle}</p>
                    </div>

                    <div className="flex items-end gap-2 pt-1">
                      {plan.key === PLAN_KEYS.FREE ? (
                        <p className="text-5xl font-semibold text-white leading-none">0</p>
                      ) : (
                        <>
                          {currencySymbol && (
                            <p className="text-3xl text-slate-300 pb-1">{currencySymbol}</p>
                          )}
                          <p className="text-5xl font-semibold text-white leading-none">{plainPrice}</p>
                        </>
                      )}
                      <p className="text-slate-400 text-sm pb-1">
                        {plan.key === PLAN_KEYS.FREE ? '/ forever' : '/ year'}
                      </p>
                    </div>

                    {isCurrent && (
                      <div className="mt-1 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-center text-sm md:text-base font-semibold text-slate-200">
                        Your current plan
                      </div>
                    )}
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => handlePlanAction(plan.key)}
                      className="w-full mt-5 rounded-xl px-5 py-3.5 text-sm md:text-base font-semibold tracking-tight transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                      style={{
                        color: '#050505',
                        background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                        border: '1px solid rgba(255,255,255,0.85)',
                        boxShadow: '0 12px 28px rgba(255,255,255,0.12)'
                      }}
                      disabled={isLoading || isSubmittingPlan === plan.key}
                    >
                      {isSubmittingPlan === plan.key
                        ? 'Starting checkout...'
                        : plan.key === PLAN_KEYS.PREMIUM_PLUS
                        ? 'Upgrade to Premium+'
                        : plan.key === PLAN_KEYS.PREMIUM
                        ? 'Upgrade to Premium'
                        : 'Switch to Free'}
                    </button>
                  )}

                  <div className="my-6 h-px bg-white/10" />

                  <div className="space-y-3 mt-1">
                    {plan.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <svg className="w-4 h-4 mt-1 shrink-0 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-5 text-xs text-slate-500">
                    {plan.key === PLAN_KEYS.FREE
                      ? 'Free forever plan.'
                      : 'Manage billing anytime in your account settings.'}
                  </div>
                </article>
              );
            })}
          </section>

          <p className="text-xs text-slate-500 text-center">
            Free bonus active: +5 extra records when you{' '}
            <Link href="/github" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">
              verify your GitHub star
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}