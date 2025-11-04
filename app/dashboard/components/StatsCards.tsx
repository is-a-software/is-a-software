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
      <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] hover:border-[#555555] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(255,255,255,0.04)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Your Domains</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.total : (domainsLoading ? '—' : domainsCount)}
              </p>
            </div>
            <div className="p-2 bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#333333] rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.03)]">
              <Globe className="h-6 w-6 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] hover:border-[#555555] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(255,255,255,0.04)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Live & Active</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.active : (domainsLoading ? '—' : activeCount)}
              </p>
            </div>
            <div className="p-2 bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#333333] rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.03)]">
              <CheckCircle className="h-6 w-6 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/30 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Configuring</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.pending : (domainsLoading ? '—' : Math.max(0, domainsCount - activeCount))}
              </p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}