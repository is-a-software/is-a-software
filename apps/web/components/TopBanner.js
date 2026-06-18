'use client';

import { useEffect, useState } from 'react';
import { useWaitlist } from '@/lib/waitlist';

export default function TopBanner() {
  const { openWaitlist } = useWaitlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      className="w-full relative z-40 overflow-hidden"
      style={{
        animation: mounted ? 'slideDown 400ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.10) 80%, transparent)',
        }}
      />

      <div
        className="relative"
        style={{
          background: 'linear-gradient(180deg, rgba(18,18,18,0.95), rgba(10,10,10,0.9))',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-1.5 min-h-[36px] flex items-center justify-center flex-wrap gap-x-1.5 gap-y-0.5 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1 text-slate-400 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" style={{ animation: 'breathe 2.5s ease-in-out infinite' }} />
            Backend migration in progress.
          </span>

          <button
            onClick={openWaitlist}
            className="text-white hover:text-slate-300 transition-colors underline underline-offset-2 whitespace-nowrap"
          >
            Join the waitlist
          </button>

          <span className="text-slate-600 hidden sm:inline select-none">·</span>

          <a
            href="https://github.com/is-a-software/is-a-software"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:text-slate-300 transition-colors underline underline-offset-2 whitespace-nowrap"
          >
            Star our GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
}
