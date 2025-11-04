import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          Get Started
        </CardTitle>
        <CardDescription className="text-gray-400">
          Create new subdomains from here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full bg-blue-400 hover:bg-blue-300 text-black border-0 shadow-[0_0_20px_rgba(96,165,250,0.4)] hover:shadow-[0_0_30px_rgba(96,165,250,0.6)] transition-all">
          <Link href="/dashboard/subdomains/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Subdomain
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}