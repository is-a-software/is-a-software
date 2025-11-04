import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]" />
          Get Started
        </CardTitle>
        <CardDescription className="text-gray-400">
          Create new subdomains from here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full bg-gradient-to-r from-black to-[#1a1a1a] hover:from-[#0a0a0a] hover:to-[#2a2a2a] text-white border border-[#333333] shadow-lg shadow-white/[0.05] hover:shadow-white/[0.08] transition-all">
          <Link href="/dashboard/subdomains/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Subdomain
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}