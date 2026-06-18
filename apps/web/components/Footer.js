'use client';

import Link from 'next/link';

export default function Footer() {
  const cyear = new Date().getFullYear();
  const brand = 'is-a.software';

  return (
    <footer
      className="relative mt-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(18,18,18,0.82), rgba(10,10,10,0.66))',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.45)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.10) 80%, transparent)',
        }}
      />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">

        <div className="flex justify-center mb-10 md:mb-16 group">
          <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight select-none whitespace-nowrap">
            {brand.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block transition-all duration-300 md:group-hover:opacity-20 md:hover:!opacity-100 md:hover:scale-110"
                style={{
                  color: 'rgba(148,163,184,0.45)',
                  transition: 'color 300ms, opacity 300ms, transform 300ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f8fafc';
                  e.currentTarget.style.textShadow = '0 0 40px rgba(255,255,255,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(148,163,184,0.45)';
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
        </div>

        <div
          className="mb-12 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.06) 80%, transparent)',
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4">
            <h3 className="text-white font-semibold">is-a.software</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(203,213,225,0.65)' }}>
              Your personal domain service for developers
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.8)' }}>Product</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'rgba(203,213,225,0.75)' }}>
              <li><Link href="/signup" className="hover:text-white transition-colors duration-200">Get Started</Link></li>
              <li><Link href="/signin" className="hover:text-white transition-colors duration-200">Sign In</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.8)' }}>Resources</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'rgba(203,213,225,0.75)' }}>
              <li><Link href="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors duration-200">Documentation</Link></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Status</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.8)' }}>Community</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'rgba(203,213,225,0.75)' }}>
              <li>
                <a href="https://github.com/is-a-software/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://x.com/priyazsh" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://discord.com/invite/AeAjegXn6D" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mb-8 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 70%, transparent)',
          }}
        />

        <div className="text-center text-sm mb-8" style={{ color: 'rgba(203,213,225,0.6)' }}>
          Built with{' '}
          <span className="inline-block md:hover:scale-125 transition-transform duration-200" role="img" aria-label="love">
            ❤️
          </span>{' '}
          by{' '}
          <a
            href="https://priyazsh.github.io"
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'rgba(203,213,225,0.75)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(203,213,225,0.75)'}
          >
            Priyansh Prajapat
          </a>{' '}
          and{' '}
          <a
            href="https://github.com/chetansisodiya1"
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'rgba(203,213,225,0.75)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(203,213,225,0.75)'}
          >
            Chetan Singh
          </a>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p style={{ color: 'rgba(203,213,225,0.55)' }}>&copy; {cyear} is-a.software. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors duration-200" style={{ color: 'rgba(203,213,225,0.55)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(203,213,225,0.55)'}
            >Privacy</Link>
            <Link href="/terms" className="transition-colors duration-200" style={{ color: 'rgba(203,213,225,0.55)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(203,213,225,0.55)'}
            >Terms</Link>
            <a href="mailto:admin@is-a.software" className="transition-colors duration-200" style={{ color: 'rgba(203,213,225,0.55)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(203,213,225,0.55)'}
            >Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
