'use client';

export default function StatusBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={active
        ? {
            color: '#86efac',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)'
          }
        : {
            color: '#94a3b8',
            background: 'rgba(255,255,255,0.05)'
          }}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
