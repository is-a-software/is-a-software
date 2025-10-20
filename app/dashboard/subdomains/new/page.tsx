"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Terminal, ArrowLeft, Globe, Server, FileText, Shield, CheckCircle } from 'lucide-react';

export default function NewSubdomainPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
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
        return <FileText className="h-4 w-4 text-cyan-400" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!githubLogin) {
      setError('Unable to determine your GitHub username.');
      return;
    }
    if (!name || !type || !value) {
      setError('Please fill all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/subdomains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ownerGithub: githubLogin, record: { [type]: value }, proxy })
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create subdomain';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#111111] px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <Terminal className="h-7 w-7 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Create New Subdomain</h1>
        </div>

        <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Register a subdomain</CardTitle>
            <CardDescription className="text-gray-300">This will commit on you behalf to add your domain.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Subdomain</label>
                <div className="mt-1 flex items-center gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="flex-1 bg-black/40 border border-gray-700 text-white rounded px-3 py-2" placeholder="myapp" />
                  <span className="text-gray-400">.is-a.software</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-gray-300 text-sm">Record Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-black/40 border border-gray-700 text-white rounded px-2 py-2 mt-1">
                    <option value="CNAME">CNAME</option>
                    <option value="A">A</option>
                    <option value="AAAA">AAAA</option>
                    <option value="TXT">TXT</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-gray-300 text-sm">Value</label>
                  <input 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)} 
                    className="w-full bg-black/40 border border-gray-700 text-white rounded px-3 py-2 mt-1" 
                    placeholder={getPlaceholderForType(type)}
                  />
                </div>
              </div>

              {/* Record Type Information */}
              <div className="p-3 bg-black/20 rounded border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  {getRecordIcon(type)}
                  <span className="text-sm font-medium text-gray-300">{type} Record</span>
                </div>
                <div className="text-xs text-gray-400">
                  {type === 'CNAME' && 'Points your subdomain to another domain name (e.g., GitHub Pages, Vercel)'}
                  {type === 'A' && 'Points your subdomain to an IPv4 address (e.g., 192.168.1.1)'}
                  {type === 'AAAA' && 'Points your subdomain to an IPv6 address (e.g., 2001:db8::1)'}
                  {type === 'TXT' && 'Adds text records for verification, SPF, DKIM, or other purposes'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input id="proxy" type="checkbox" checked={proxy} onChange={(e) => setProxy(e.target.checked)} className="h-4 w-4" />
                <label htmlFor="proxy" className="text-gray-300 text-sm">Enable proxy (Cloudflare orange cloud)</label>
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}
              {success && (
                <div className="text-green-400 text-sm bg-green-900/20 border border-green-500/20 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Subdomain created successfully!</span>
                  </div>
                  <p className="text-xs text-green-300">
                    Your subdomain is being processed and will be active within 10-30 seconds. 
                    You&apos;ll be redirected to the dashboard where you can monitor its status.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => router.push('/dashboard')}>Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" disabled={submitting}>{submitting ? 'Creating...' : 'Create Subdomain'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


