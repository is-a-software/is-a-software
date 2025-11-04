import { Card, CardContent } from '@/app/components/ui/card';
import { Globe, CheckCircle, Clock } from 'lucide-react';

export interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    pending: number;
  } | null;
  domainsLoading: boolean;
  domainsCount: number;
  activeCount: number;
}

export function StatsCards({ 
  stats, 
  domainsLoading, 
  domainsCount, 
  activeCount 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-blue-500/30 hover:border-blue-400/50 transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Your Domains</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.total : (domainsLoading ? '—' : domainsCount)}
              </p>
            </div>
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Globe className="h-6 w-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-green-500/30 hover:border-green-400/50 transition-all shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Live & Active</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.active : (domainsLoading ? '—' : activeCount)}
              </p>
            </div>
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <CheckCircle className="h-6 w-6 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-yellow-500/30 hover:border-yellow-400/50 transition-all shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_30px_rgba(234,179,8,0.25)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Configuring</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.pending : (domainsLoading ? '—' : Math.max(0, domainsCount - activeCount))}
              </p>
            </div>
            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <Clock className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}