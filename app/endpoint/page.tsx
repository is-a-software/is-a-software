"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Footer } from '@/app/components/Footer'
import { Navbar } from '@/app/components/Navbar'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Code, Wrench } from 'lucide-react'

export default function ApiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar currentPage="api" />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            API
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Programmatic access to the is-a.software subdomain service.
          </p>
          <Badge variant="outline" className="mt-4">
            <Code className="w-4 h-4 mr-2" />
            Coming Soon
          </Badge>
        </div>

        {/* Work in Progress Card */}
        <Card className="mb-8 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Wrench className="h-6 w-6" />
              Working on it!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 dark:text-amber-300 text-lg leading-relaxed">
              We&apos;re currently developing comprehensive API endpoints. 
              This will allow developers to manage their subdomains, 
              check availability, and integrate is-a.software into their applications.
            </p>
            <p className="text-amber-600 dark:text-amber-400 text-sm mt-4">
              <strong>Will be implemented soon!</strong> Stay tuned for updates.
            </p>
          </CardContent>
        </Card>

        {/* Planned Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-500" />
              Planned API Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Subdomain Management</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Create new subdomains</li>
                  <li>• Update DNS records</li>
                  <li>• Delete subdomains</li>
                  <li>• List your subdomains</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Utilities</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Check subdomain availability</li>
                  <li>• Validate DNS records</li>
                  <li>• Get subdomain status</li>
                  <li>• Webhook notifications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}