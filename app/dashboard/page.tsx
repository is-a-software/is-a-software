"use client";

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  Terminal, 
  Plus, 
  Globe, 
  Settings, 
  LogOut,
  Activity,
  Clock,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  validateDNSRecord, 
  getDNSRecordExample, 
  getDNSRecordDescription, 
  type DNSRecordType 
} from '@/lib/dns-validation';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [domains, setDomains] = useState<Array<{ domain: string; owner: { github: string }; record: Record<string, string>; proxy?: boolean }>>([]);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [domainsError, setDomainsError] = useState('');
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});
  const [activity, setActivity] = useState<Array<{ domain: string; message: string; author: string; date: string; html_url: string }>>([]);
  const [activityError, setActivityError] = useState('');
  const [stats, setStats] = useState<{ total: number; active: number; pending: number } | null>(null);
  const [uptime, setUptime] = useState<{ percentage: number; status: string } | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editDomain, setEditDomain] = useState<string>('');
  const [editType, setEditType] = useState<string>('CNAME');
  const [editValue, setEditValue] = useState<string>('');
  const [editProxy, setEditProxy] = useState<boolean>(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editValidation, setEditValidation] = useState<{ isValid: boolean; message: string }>({ isValid: true, message: '' });
  const [editRetryCount, setEditRetryCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const githubLogin = useMemo(() => {
    // Best-effort: try to derive github username from displayName or email prefix as fallback.
    // In production, prefer storing verified GitHub login in user metadata.
    const userInfo = user as { reloadUserInfo?: { screenName?: string } } | null;
    return userInfo?.reloadUserInfo?.screenName || (user?.email ? user.email.split('@')[0] : undefined);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !githubLogin) return;
    const login = githubLogin.toLowerCase(); 
    let aborted = false;
    async function load() {
      setDomainsLoading(true);
      setDomainsError('');
      try {
        const res = await fetch(`/api/subdomains?owner=${encodeURIComponent(login)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());
        const items: Array<{ domain: string; owner: { github: string }; record: Record<string, string>; proxy?: boolean }> = await res.json();
        const filtered = items.filter((i) => i.owner?.github?.toLowerCase() === login);
        if (!aborted) setDomains(filtered.map((i) => ({ domain: i.domain, owner: i.owner, record: i.record, proxy: i.proxy })));
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load domains';
        if (!aborted) setDomainsError(message);
      } finally {
        if (!aborted) setDomainsLoading(false);
      }
    }
    load();
    return () => { aborted = true; };
  }, [user, githubLogin]);

  const refreshDomainStatuses = useCallback(async () => {
    if (!domains || domains.length === 0) return;
    setRefreshing(true);
    try {
      const entries = await Promise.all(domains.map(async (d) => {
        try {
          const r = await fetch(`/api/domain-status?subdomain=${encodeURIComponent(d.domain)}`, { cache: 'no-store' });
          if (!r.ok) throw new Error();
          const j = await r.json();
          return [d.domain, j.status === 'active'] as const;
        } catch {
          return [d.domain, false] as const;
        }
      }));
      const map: Record<string, boolean> = {};
      for (const [k, v] of entries) map[k] = v;
      setActiveMap(map);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh domain statuses:', error);
    } finally {
      setRefreshing(false);
    }
  }, [domains]);

  useEffect(() => {
    if (!domains || domains.length === 0) return;
    let aborted = false;
    async function checkAll() {
      const entries = await Promise.all(domains.map(async (d) => {
        try {
          const r = await fetch(`/api/domain-status?subdomain=${encodeURIComponent(d.domain)}`, { cache: 'no-store' });
          if (!r.ok) throw new Error();
          const j = await r.json();
          return [d.domain, j.status === 'active'] as const;
        } catch {
          return [d.domain, false] as const;
        }
      }));
      if (!aborted) {
        const map: Record<string, boolean> = {};
        for (const [k, v] of entries) map[k] = v;
        setActiveMap(map);
        setLastRefresh(new Date());
      }
    }
    checkAll();
    return () => { aborted = true; };
  }, [domains, refreshDomainStatuses]);

  useEffect(() => {
    if (!githubLogin) return;
    const login = githubLogin.toLowerCase(); // ensure lowercase for API
    let aborted = false;
    async function loadActivity() {
      setActivityError('');
      try {
        const r = await fetch(`/api/activity?owner=${encodeURIComponent(login)}&limit=2`, { cache: 'no-store' });
        if (!r.ok) throw new Error(await r.text());
        const j = await r.json();
        if (!aborted) setActivity(j);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load activity';
        if (!aborted) setActivityError(message);
      }
    }
    loadActivity();
    return () => { aborted = true; };
  }, [githubLogin]);

  // Fetch stats and uptime
  useEffect(() => {
    if (!githubLogin) return;
    const login = githubLogin.toLowerCase(); // ensure lowercase for API
    let aborted = false;
    async function loadStats() {
      try {
        const [statsRes, uptimeRes] = await Promise.all([
          fetch(`/api/stats?owner=${encodeURIComponent(login)}`, { cache: 'no-store' }),
          fetch('/api/uptime', { cache: 'no-store' })
        ]);
        
        if (statsRes.ok && !aborted) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (uptimeRes.ok && !aborted) {
          const uptimeData = await uptimeRes.json();
          setUptime(uptimeData);
        }
      } catch {
        // Silent fail for stats loading
      }
    }
    loadStats();
    return () => { aborted = true; };
  }, [githubLogin]);

  // Auto-refresh every 30 seconds for pending domains
  useEffect(() => {
    if (!domains || domains.length === 0) return;
    const hasPendingDomains = Object.values(activeMap).some(status => !status);
    if (!hasPendingDomains) return;
    const interval = setInterval(() => {
      refreshDomainStatuses();
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [domains, activeMap, refreshDomainStatuses]);

  // Validate DNS record in real-time
  useEffect(() => {
    if (!editOpen || !editType || !editValue) {
      setEditValidation({ isValid: true, message: '' });
      return;
    }
    
    const validation = validateDNSRecord(editType as DNSRecordType, editValue);
    setEditValidation(validation);
  }, [editType, editValue, editOpen]);

  const openEdit = (d: { domain: string; record: Record<string, string>; proxy?: boolean }) => {
    const t = Object.keys(d.record || {})[0] || 'CNAME';
    const v = t ? d.record[t] : '';
    setEditDomain(d.domain);
    setEditType(t);
    setEditValue(String(v || ''));
    setEditProxy(!!d.proxy);
    setEditError('');
    setEditValidation({ isValid: true, message: '' });
    setEditRetryCount(0);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editDomain || !editType || !editValue) return;
    
    // Validate before saving
    if (!editValidation.isValid) {
      setEditError(`Invalid DNS record: ${editValidation.message}`);
      return;
    }
    
    setEditSaving(true);
    setEditError('');
    try {
      const res = await fetch(`/api/subdomains/${encodeURIComponent(editDomain)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          record: { [editType]: editValue }, 
          proxy: editProxy,
          user: githubLogin 
        })
      });
      if (!res.ok) throw new Error(await res.text());
      // Refresh domains list
      const r = await fetch(`/api/subdomains?owner=${encodeURIComponent(githubLogin || '')}`, { cache: 'no-store' });
      if (r.ok) {
        const items: Array<{ domain: string; owner: { github: string }; record: Record<string, string>; proxy?: boolean }> = await r.json();
        setDomains(items.map((i) => ({ domain: i.domain, owner: i.owner, record: i.record, proxy: i.proxy })));
      }
      setEditOpen(false);
    } catch (e) {
      let message = 'Failed to save DNS record';
      
      if (e instanceof Error) {
        const errorText = e.message.toLowerCase();
        
        if (errorText.includes('not found') || errorText.includes('404')) {
          message = 'Domain not found. Please refresh and try again.';
        } else if (errorText.includes('unauthorized') || errorText.includes('403')) {
          message = 'You do not have permission to edit this domain.';
        } else if (errorText.includes('network') || errorText.includes('fetch')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (errorText.includes('validation') || errorText.includes('invalid')) {
          message = `Invalid DNS record: ${e.message}`;
        } else if (errorText.includes('rate limit')) {
          message = 'Too many requests. Please wait a moment and try again.';
        } else if (errorText.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = e.message || 'An unexpected error occurred';
        }
      }
      
      setEditError(message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#111111]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">is-a.software</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-600"
                  />
                )}
                {/* <div className="flex items-center gap-2 text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.displayName || user.email}</span>
                </div> */}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.displayName || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-300">
            Manage your subdomains and DNS settings from your dashboard.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Subdomains</p>
                  <p className="text-2xl font-bold text-white">{stats ? stats.total : (domainsLoading ? '—' : domains.length)}</p>
                </div>
                <Globe className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active</p>
                  <p className="text-2xl font-bold text-white">{stats ? stats.active : (domainsLoading ? '—' : Object.values(activeMap).filter(Boolean).length)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-white">{stats ? stats.pending : (domainsLoading ? '—' : Math.max(0, domains.length - Object.values(activeMap).filter(Boolean).length))}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Uptime</p>
                  <p className="text-2xl font-bold text-white">{uptime ? `${uptime.percentage.toFixed(1)}%` : '99.9%'}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-300">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                <Link href="/dashboard/subdomains/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Subdomain
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Link href="/dashboard/dns">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage DNS Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-300">
                Your latest subdomain activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityError && (
                  <div className="text-red-400 text-sm">{activityError}</div>
                )}
                {activity.length === 0 ? (
                  <div className="text-gray-400 text-sm">No recent activity found.</div>
                ) : (
                  activity
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 2)
                    .map((a, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div>
                          <p className="text-white text-sm font-medium">{a.domain}.is-a.software</p>
                          <p className="text-gray-400 text-xs truncate max-w-[42ch]">{a.message}</p>
                          <p className="text-gray-500 text-xs">{new Date(a.date).toLocaleString()}</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white" asChild>
                          <a href={a.html_url} target="_blank" rel="noreferrer">View</a>
                        </Button>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subdomains List */}
        <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Your Subdomains</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage all your subdomains in one place
                  {lastRefresh && (
                    <span className="ml-2 text-xs text-gray-400">
                      • Last updated: {lastRefresh.toLocaleTimeString()}
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={refreshDomainStatuses}
                  disabled={refreshing}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white border-0">
                  <Link href="/dashboard/subdomains">
                    View All
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {domainsError && (
                <div className="text-red-400 text-sm">{domainsError}</div>
              )}
              {domainsLoading ? (
                <div className="text-gray-400 text-sm">Loading your subdomains...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {domains.length === 0 && (
                    <div className="text-gray-400 text-sm">No subdomains found for your account.</div>
                  )}
                  {domains.map((d) => {
                    const targetType = Object.keys(d.record || {})[0];
                    const targetValue = targetType ? d.record[targetType] : '';
                    const hostname = `${d.domain}.is-a.software`;
                    return (
                      <div key={d.domain} className="p-4 bg-black/20 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">{hostname}</h3>
                          {activeMap[d.domain] ? (
                            <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-500/20 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-400 border-yellow-500/20 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm mb-3">
                          <span className="text-gray-500">{targetType}:</span> 
                          <span className="ml-1 font-mono text-xs">
                            {targetType === 'TXT' ? `"${targetValue}"` : String(targetValue)}
                          </span>
                        </div>
                        {!activeMap[d.domain] && (
                          <div className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-500/20 rounded px-2 py-1 mb-3">
                            ⏳ DNS propagation in progress... This usually takes 10-30 seconds
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => openEdit(d)}>
                            <Settings className="h-3 w-3 mr-1" />
                            DNS
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white" asChild>
                            <a href={`https://${hostname}`} target="_blank" rel="noreferrer">
                              <Globe className="h-3 w-3 mr-1" />
                              Visit
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      {/* Edit DNS Dialog */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-black/90 border border-gray-700 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-purple-400" />
              <h3 className="text-white text-lg font-semibold">Edit DNS Record</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              <span className="font-mono">{editDomain}.is-a.software</span>
            </p>
            
            <div className="space-y-4 mb-6">
              {/* Record Type Section */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                  Record Type
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                </label>
                <select 
                  value={editType} 
                  onChange={(e) => setEditType(e.target.value)} 
                  className="w-full bg-black/40 border border-gray-700 text-white rounded-md px-3 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                >
                  <option value="CNAME">CNAME - Alias to another domain</option>
                  <option value="A">A - IPv4 address</option>
                  <option value="AAAA">AAAA - IPv6 address</option>
                  <option value="TXT">TXT - Text record</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {getDNSRecordDescription(editType as DNSRecordType)}
                </p>
              </div>

              {/* Value Section */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                  Value
                  {!editValidation.isValid && (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                </label>
                <input 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)} 
                  className={`w-full bg-black/40 border rounded-md px-3 py-2.5 focus:ring-1 transition-colors ${
                    !editValidation.isValid 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-100' 
                      : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500 text-white'
                  }`}
                  placeholder={getDNSRecordExample(editType as DNSRecordType)}
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Example: {getDNSRecordExample(editType as DNSRecordType)}
                  </p>
                  {editValue && (
                    <p className={`text-xs ${editValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                      {editValidation.isValid ? '✓ Valid' : `✗ ${editValidation.message}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Proxy Section */}
              <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-md border border-gray-700">
                <input 
                  id="proxy" 
                  type="checkbox" 
                  checked={editProxy} 
                  onChange={(e) => setEditProxy(e.target.checked)} 
                  className="h-4 w-4 mt-0.5 accent-purple-500" 
                />
                <div>
                  <label htmlFor="proxy" className="text-gray-300 text-sm font-medium block">
                    Enable Cloudflare Proxy
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Routes traffic through Cloudflare for added security, caching, and DDoS protection. 
                    Only available for A, AAAA, and CNAME records.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {editError && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {editError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white" 
                onClick={() => setEditOpen(false)} 
                disabled={editSaving}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 disabled:opacity-50" 
                onClick={saveEdit} 
                disabled={editSaving || !editValidation.isValid}
              >
                {editSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
