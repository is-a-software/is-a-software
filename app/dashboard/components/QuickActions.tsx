import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-purple-400" />
          Get Started
        </CardTitle>
        <CardDescription className="text-gray-300">
          Create new subdomains from here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg">
          <Link href="/dashboard/subdomains/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Subdomain
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}