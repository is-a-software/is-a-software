import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Activity, AlertCircle, Clock } from 'lucide-react';

export interface ActivityItem {
  domain: string;
  message: string;
  author: string;
  date: string;
  html_url: string;
}

export interface RecentActivityProps {
  activity: ActivityItem[];
  activityError: string;
}

export function RecentActivity({ activity, activityError }: RecentActivityProps) {
  return (
    <Card className="lg:col-span-2 bg-black/30 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          Recent Changes
        </CardTitle>
        <CardDescription className="text-gray-300">
          Latest updates to your subdomain configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              {activityError}
            </div>
          )}
          {activity.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity yet.</p>
              <p className="text-xs mt-1">Your domain changes will appear here.</p>
            </div>
          ) : (
            activity
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 1)
              .map((a, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{a.domain}.is-a.software</p>
                    <p className="text-gray-400 text-xs truncate max-w-[50ch] mt-1">{a.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{new Date(a.date).toLocaleString()}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white ml-4" asChild>
                    <a href={a.html_url} target="_blank" rel="noreferrer">View</a>
                  </Button>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}