import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card className="bg-[#0C0C0C] border-[#333333]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-white" />
          Get Started
        </CardTitle>
        <CardDescription className="text-gray-400">
          Create new subdomains from here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full bg-[#000000] hover:bg-[#0C0C0C] text-white border border-[#333333] shadow-lg">
          <Link href="/dashboard/subdomains/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Subdomain
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}