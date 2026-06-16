'use client';

export const BACKEND_DOWN = '__BACKEND_DOWN__';

function CfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '0.2rem' }}>
      <circle cx="8" cy="8" r="7" stroke="#fca5a5" strokeWidth="1.5" fill="none" />
      <path d="M5 8h6M8 5v6" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function getBannerStyle(type) {
  switch (type) {
    case 'cloudflare':
      return {
        background: 'linear-gradient(135deg, rgba(127,29,29,0.35), rgba(69,10,10,0.45))',
        border: '1px solid rgba(220,38,38,0.35)',
        color: '#fca5a5',
      };
    case 'validation':
      return {
        background: 'rgba(251,191,36,0.1)',
        border: '1px solid rgba(251,191,36,0.2)',
        color: '#fbbf24',
      };
    case 'limit':
      return {
        background: 'rgba(251,146,60,0.1)',
        border: '1px solid rgba(251,146,60,0.2)',
        color: '#fb923c',
      };
    case 'subscription':
      return {
        background: 'rgba(167,139,250,0.1)',
        border: '1px solid rgba(167,139,250,0.2)',
        color: '#c4b5fd',
      };
    default:
      return {
        background: 'rgba(127,29,29,0.14)',
        border: '1px solid rgba(220,38,38,0.18)',
        color: '#fca5a5',
      };
  }
}

export default function ErrorBanner({ error, status }) {
  if (!error) return null;

  let bannerType = 'default';
  let displayMessage = error;

  if (typeof error === 'object' && error !== null) {
    status = error.status || status;
    displayMessage = error.message || 'Request failed';
  }

  if (status === 502) bannerType = 'cloudflare';
  else if (status === 422) bannerType = 'validation';
  else if (status === 403) bannerType = 'limit';
  else if (status === 402) bannerType = 'subscription';

  const style = getBannerStyle(bannerType);

  if (typeof error === 'string' && error === BACKEND_DOWN) {
    return (
      <div role="alert" style={{
        background: 'linear-gradient(135deg, rgba(127,29,29,0.28), rgba(69,10,10,0.38))',
        border: '1px solid rgba(220,38,38,0.28)',
        borderRadius: '0.875rem',
        padding: '0.9rem 1rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 24px rgba(220,38,38,0.08)',
      }}>
        <div style={{ paddingTop: '0.25rem', flexShrink: 0 }}>
          <span className="animate-pulse" style={{
            display: 'block',
            width: '0.55rem',
            height: '0.55rem',
            borderRadius: '50%',
            background: '#dc2626',
            boxShadow: '0 0 0 3px rgba(220,38,38,0.22)',
          }} />
        </div>
        <div>
          <p style={{ color: '#fca5a5', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem' }}>
            Backend is down
          </p>
          <p style={{ color: 'rgba(252,165,165,0.6)', fontSize: '0.8rem', lineHeight: 1.45 }}>
            Could not reach the server. Check your connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div role="alert" style={{
      ...style,
      borderRadius: '0.875rem',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'flex-start',
    }}>
      {bannerType === 'cloudflare' && <CfIcon />}
      <span>{displayMessage}</span>
    </div>
  );
}
