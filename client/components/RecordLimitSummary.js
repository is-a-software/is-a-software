'use client';

import Link from 'next/link';

function getUsageRatio(recordsUsed, recordLimit) {
  if (!recordLimit) return 0;
  return recordsUsed / recordLimit;
}

export function getLimitTone(recordsUsed, recordLimit) {
  const ratio = getUsageRatio(recordsUsed, recordLimit);
  if (recordsUsed >= recordLimit && recordLimit > 0) return 'danger';
  if (ratio >= 0.8) return 'warning';
  return 'normal';
}

export default function RecordLimitSummary({ limits, showActions = false, compact = false }) {
  const { recordsUsed, recordLimit, premium, githubBonus } = limits;
  const tone = getLimitTone(recordsUsed, recordLimit);
  const ratioPct = recordLimit ? Math.min(100, Math.round((recordsUsed / recordLimit) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">DNS Records Used</span>
        <span className="text-white font-medium">{recordsUsed} / {recordLimit}</span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${ratioPct}%`,
            background: tone === 'danger'
              ? '#f87171'
              : tone === 'warning'
                ? '#fbbf24'
                : 'linear-gradient(90deg, #60a5fa, #a78bfa)'
          }}
        />
      </div>

      {!compact && (
        <p className="text-xs text-slate-500">
          {tone === 'danger'
            ? 'You are at the record limit.'
            : tone === 'warning'
              ? 'You are close to the record limit.'
              : 'Record usage is healthy.'}
        </p>
      )}

      {showActions && (tone === 'warning' || tone === 'danger') && (
        <div className="flex items-center gap-4 pt-1">
          {!premium && (
            <Link href="/subscriptions" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Upgrade Your Plan (Manage Subscription)
            </Link>
          )}
          {!githubBonus && (
            <Link href="/github" className="text-xs text-slate-400 hover:text-white transition-colors">
              GitHub Star Bonus (+3) →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
