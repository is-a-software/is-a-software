export interface WelcomeSectionProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function WelcomeSection({ userName, userEmail }: WelcomeSectionProps) {
  const displayName = userName || userEmail?.split('@')[0] || 'User';

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
        Welcome back, <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">{displayName}</span>!
      </h1>
      <p className="text-gray-300">
        Your developer subdomain control center. Create, configure, and monitor all your .is-a.software domains.
      </p>
    </div>
  );
}