'use client';

export default function StatsGrid({ domainsCount, recordsUsed, recordLimit, lastUpdated }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="glass p-6 space-y-2">
        <p className="text-slate-400 text-sm">Domains</p>
        <p className="text-3xl font-bold accent-ice">{domainsCount}</p>
      </div>
      <div className="glass p-6 space-y-2">
        <p className="text-slate-400 text-sm">DNS Records</p>
        <p className="text-lg status-good">{recordsUsed} / {recordLimit}</p>
      </div>
      <div className="glass p-6 space-y-2">
        <p className="text-slate-400 text-sm">Last Updated</p>
        <p className="text-sm text-slate-300">{lastUpdated}</p>
      </div>
    </div>
  );
}
