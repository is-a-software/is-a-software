"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Footer } from '@/app/components/Footer';
import { Toaster } from '@/app/components/ui/sonner';
import { Terminal, ArrowLeft, Globe, Server, FileText, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditSubdomainPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const subdomainName = params.name as string;
  
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('CNAME');
  const [value, setValue] = useState('');
  const [proxy, setProxy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const githubLogin = useMemo(() => {
    const userInfo = user as { reloadUserInfo?: { screenName?: string } } | null;
    return userInfo?.reloadUserInfo?.screenName || (user?.email ? user.email.split('@')[0] : undefined);
  }, [user]);

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await user?.getIdToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, [user]);

  // Load existing domain data
  useEffect(() => {
    if (!user || !githubLogin || !subdomainName) return;

    async function loadDomain() {
      try {
        setLoading(true);
        setError('');
        
        const authHeaders = await getAuthHeaders();
        const response = await fetch(`/api/subdomains?owner=${encodeURIComponent(githubLogin || '')}`, {
          headers: authHeaders
        });

        if (!response.ok) {
          throw new Error('Failed to load domain data');
        }

        const domains = await response.json();
        const domain = domains.find((d: { domain: string }) => d.domain === subdomainName);
        
        if (!domain) {
          throw new Error('Domain not found or you do not have access to it');
        }
        
        // Set form values from existing data
        const recordType = Object.keys(domain.record)[0];
        const recordValue = domain.record[recordType];
        setType(recordType);
        setValue(recordValue);
        setProxy(!!domain.proxy);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load domain';
        setError(errorMessage);
        toast.error('Failed to load domain', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    }

    loadDomain();
  }, [user, githubLogin, subdomainName, getAuthHeaders]);

  const getPlaceholderForType = (recordType: string) => {
    switch (recordType) {
      case 'CNAME':
        return 'target.example.com or your-app.vercel.app';
      case 'A':
        return '192.168.1.1 (IPv4 address)';
      case 'AAAA':
        return '2001:db8::1 (IPv6 address)';
      case 'TXT':
        return 'v=spf1 include:_spf.google.com ~all';
      default:
        return 'Enter the record value';
    }
  };

  const getRecordIcon = (recordType: string) => {
    switch (recordType) {
      case 'CNAME':
        return <Globe className="h-4 w-4 text-blue-400" />;
      case 'A':
      case 'AAAA':
        return <Server className="h-4 w-4 text-green-400" />;
      case 'TXT':
        return <FileText className="h-4 w-4 text-purple-400" />;
      default:
        return <Shield className="h-4 w-4 text-orange-400" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subdomainName || !type || !value.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`/api/subdomains/${subdomainName}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          record: { [type]: value.trim() },
          proxy
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update subdomain');
      }

      setSuccess(true);
      toast.success('Subdomain updated successfully!', {
        description: 'Your DNS configuration has been saved.',
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subdomain';
      setError(errorMessage);
      toast.error('Failed to update subdomain', {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#111111] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading subdomain data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#111111]">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-purple-400" />
              <h1 className="text-xl font-semibold text-white">
                Edit {subdomainName}.is-a.software
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {success ? (
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-green-400">
                <CheckCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Subdomain Updated Successfully!</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Your changes have been saved. Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Update DNS Configuration</CardTitle>
              <CardDescription className="text-gray-300">
                Modify the DNS settings for your subdomain. Changes may take a few minutes to propagate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="subdomain" className="text-white">Subdomain</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="subdomain"
                      value={subdomainName}
                      disabled
                      className="bg-gray-800/50 border-gray-600 text-gray-400 cursor-not-allowed"
                    />
                    <span className="text-gray-400 whitespace-nowrap">.is-a.software</span>
                  </div>
                  <p className="text-xs text-gray-500">Subdomain name cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-white">DNS Record Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="CNAME" className="text-white hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          {getRecordIcon('CNAME')}
                          CNAME - Canonical Name
                        </div>
                      </SelectItem>
                      <SelectItem value="A" className="text-white hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          {getRecordIcon('A')}
                          A - IPv4 Address
                        </div>
                      </SelectItem>
                      <SelectItem value="AAAA" className="text-white hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          {getRecordIcon('AAAA')}
                          AAAA - IPv6 Address
                        </div>
                      </SelectItem>
                      <SelectItem value="TXT" className="text-white hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          {getRecordIcon('TXT')}
                          TXT - Text Record
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value" className="text-white">Target Value</Label>
                  <Input
                    id="value"
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={getPlaceholderForType(type)}
                    className="bg-black/30 border-gray-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="proxy"
                    checked={proxy}
                    onChange={(e) => setProxy(e.target.checked)}
                    className="rounded border-gray-600 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <Label htmlFor="proxy" className="text-white text-sm">
                    Enable proxy protection (recommended for web services)
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Subdomain'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}