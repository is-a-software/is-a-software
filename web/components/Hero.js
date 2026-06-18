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
