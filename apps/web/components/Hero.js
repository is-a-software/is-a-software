import Typewriter from '@/components/Typewriter';

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-12 pb-12">
      <div className="max-w-2xl text-center space-y-12">
        <div className="space-y-6">
          <div className="inline-block px-3 py-1 bg-white/6 border border-white/12 rounded-full text-sm text-slate-300 mb-4">
            For developers, by developers
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight">
            Your Subdomain,
            <span className="accent-ice block"> Your Software</span>
          </h1>

          <div className="flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm sm:text-base"
              style={{
                background: 'rgba(12,12,12,0.78)',
                border: '1px solid rgba(255,255,255,0.08)',
                minWidth: 0,
              }}
            >
              <svg className="w-3.5 h-3.5 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span style={{ color: 'rgba(203,213,225,0.4)' }}>https://</span>
              <span className="text-white/90"><Typewriter /></span>
            </div>
          </div>

          <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
            Get a free is-a.software subdomain in seconds. Perfect for projects, portfolios, demos, and sharing your work with the world.
          </p>
        </div>

        <div className="pt-4 space-y-6">
          <p className="text-slate-500 text-sm uppercase tracking-wide">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-6 space-y-3 hover:bg-white/8 transition-colors">
              <div className="text-3xl font-bold accent-soft">→</div>
              <h3 className="font-semibold text-white">Check</h3>
              <p className="text-sm text-slate-400">Search for your perfect domain name</p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-3 hover:bg-white/8 transition-colors">
              <div className="text-3xl font-bold accent-soft">→</div>
              <h3 className="font-semibold text-white">Claim</h3>
              <p className="text-sm text-slate-400">One-click verification to secure it</p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-3 hover:bg-white/8 transition-colors">
              <div className="text-3xl font-bold accent-soft">✓</div>
              <h3 className="font-semibold text-white">Launch</h3>
              <p className="text-sm text-slate-400">Start using your subdomain instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
