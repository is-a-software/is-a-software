"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Footer } from '@/app/components/Footer';
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
  const [valueError, setValueError] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    checking: boolean;
    available?: boolean;
    owned?: boolean;
    message?: string;
    editUrl?: string;
  }>({ checking: false });

  const githubLogin = useMemo(() => {
    const userInfo = user as { reloadUserInfo?: { screenName?: string } } | null;
    return userInfo?.reloadUserInfo?.screenName || (user?.email ? user.email.split('@')[0] : undefined);
  }, [user]);

  const validateSubdomainName = (value: string, recordType: string) => {
    const lowercased = value.toLowerCase();
    // Allow underscores for TXT records (common for verification records like _vercel, _github, etc.)
    if (recordType === 'TXT') {
      return lowercased.replace(/[^a-z0-9-_]/g, '');
    }
    // Standard validation for other record types
    return lowercased.replace(/[^a-z0-9-]/g, '');
  };

  const validateRecordValue = (value: string, recordType: string): { isValid: boolean; message?: string } => {
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      return { isValid: false, message: 'Value cannot be empty' };
    }

    switch (recordType) {
      case 'CNAME':
        // Remove common protocol prefixes that users might accidentally add
        if (trimmedValue.match(/^https?:\/\//i)) {
          return { isValid: false, message: 'CNAME cannot contain http:// or https://' };
        }
        if (trimmedValue.match(/\/|\?|#/)) {
          return { isValid: false, message: 'CNAME should only contain domain name (no paths or query strings)' };
        }
        // Basic domain format validation
        if (!trimmedValue.match(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.?$/)) {
          return { isValid: false, message: 'Invalid domain format (e.g., example.com)' };
        }
        break;

      case 'A':
        // IPv4 validation
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipv4Regex.test(trimmedValue)) {
          return { isValid: false, message: 'Invalid IPv4 address format (e.g., 192.168.1.1)' };
        }
        break;

      case 'AAAA':
        // IPv6 validation (basic)
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^(?:(?:[0-9a-fA-F]{1,4}:)*)?(?:(?:[0-9a-fA-F]{1,4})?::(?:[0-9a-fA-F]{1,4}:)*)?(?:[0-9a-fA-F]{1,4})?$/;
        if (!ipv6Regex.test(trimmedValue)) {
          return { isValid: false, message: 'Invalid IPv6 address format (e.g., 2001:db8::1)' };
        }
        break;

      case 'TXT':
        if (trimmedValue.length > 1024) {
          return { isValid: false, message: 'TXT record cannot exceed 1024 characters' };
        }
        break;
    }

    return { isValid: true };
  };

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

  const checkAvailability = async (subdomainName: string) => {
    if (!subdomainName || subdomainName.length < 2) {
      setAvailabilityStatus({ checking: false });
      return;
    }

    setAvailabilityStatus({ checking: true });

    try {
      const token = await user?.getIdToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/subdomains/check?name=${encodeURIComponent(subdomainName)}`, {
        headers
      });

      if (res.ok) {
        const result = await res.json();
        setAvailabilityStatus({
          checking: false,
          available: result.available,
          owned: result.owned,
          message: result.reason,
          editUrl: result.editUrl
        });
      } else {
        setAvailabilityStatus({
          checking: false,
          available: undefined,
          message: 'Unable to check availability'
        });
      }
    } catch {
      setAvailabilityStatus({
        checking: false,
        available: undefined,
        message: 'Unable to check availability'
      });
    }
  };

  // Check availability when name changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (name && user) {
        checkAvailability(name);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [name, user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setValueError('');
    
    if (!githubLogin) {
      setError('Unable to determine your GitHub username.');
      return;
    }
    if (!name || !type || !value) {
      setError('Please fill all fields.');
      return;
    }

    // Validate record value
    const validation = validateRecordValue(value, type);
    if (!validation.isValid) {
      setValueError(validation.message || 'Invalid value');
      return;
    }
    setSubmitting(true);
    try {
      // Get auth headers
      const token = await user?.getIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch('/api/subdomains', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, ownerGithub: githubLogin, record: { [type]: value }, proxy })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        
        if (errorData?.code === 'OWNED_BY_USER') {
          // User owns the domain, offer to edit it
          if (confirm(`${errorData.error}\n\nClick OK to edit the existing subdomain, or Cancel to stay here.`)) {
            router.push(errorData.editUrl);
            return;
          } else {
            throw new Error('Please choose a different subdomain name or edit your existing one.');
          }
        } else if (errorData?.code === 'ALREADY_TAKEN') {
          // Domain taken by someone else
          throw new Error(errorData.error);
        } else {
          // Other errors
          throw new Error(errorData?.error || await res.text());
        }
      }
      
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
            <CardDescription className="text-gray-300">This will commit on your behalf to add your domain.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Subdomain</label>
                <div className="mt-1 flex items-center gap-2">
                  <input value={name} onChange={(e) => setName(validateSubdomainName(e.target.value, type))} className="flex-1 bg-black/40 border border-gray-700 text-white rounded px-3 py-2" placeholder={type === 'TXT' ? '_vercel' : 'myapp'} />
                  <span className="text-gray-400">.is-a.software</span>
                </div>
                {name && (
                  <div className="mt-2">
                    {availabilityStatus.checking ? (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Checking availability...
                      </div>
                    ) : availabilityStatus.available === true ? (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {availabilityStatus.message || 'Subdomain is available'}
                      </div>
                    ) : availabilityStatus.available === false ? (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center">
                          <span className="text-xs text-black font-bold">!</span>
                        </div>
                        <span>{availabilityStatus.message}</span>
                        {availabilityStatus.owned && availabilityStatus.editUrl && (
                          <button
                            type="button"
                            onClick={() => router.push(availabilityStatus.editUrl!)}
                            className="ml-2 text-purple-400 hover:text-purple-300 underline"
                          >
                            Edit existing
                          </button>
                        )}
                      </div>
                    ) : availabilityStatus.message ? (
                      <div className="flex items-center gap-2 text-yellow-400 text-sm">
                        <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                          <span className="text-xs text-black font-bold">?</span>
                        </div>
                        {availabilityStatus.message}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-gray-300 text-sm">Record Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => {
                      setType(e.target.value);
                      // Clear validation errors when type changes
                      setValueError('');
                    }} 
                    className="w-full bg-black/40 border border-gray-700 text-white rounded px-2 py-2 mt-1"
                  >
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
                    onChange={(e) => {
                      setValue(e.target.value);
                      // Clear value error when user starts typing
                      if (valueError) setValueError('');
                    }}
                    onBlur={() => {
                      // Validate on blur
                      if (value.trim()) {
                        const validation = validateRecordValue(value, type);
                        if (!validation.isValid) {
                          setValueError(validation.message || 'Invalid value');
                        }
                      }
                    }}
                    className={`w-full bg-black/40 border rounded px-3 py-2 mt-1 text-white ${
                      valueError ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder={getPlaceholderForType(type)}
                  />
                  {valueError && (
                    <p className="text-red-400 text-xs mt-1">{valueError}</p>
                  )}
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
                  {type === 'TXT' && 'Adds text records for verification, SPF, DKIM, or other purposes (underscores allowed)'}
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
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" 
                  disabled={
                    submitting || 
                    !!valueError || 
                    !name || 
                    !value || 
                    availabilityStatus.checking || 
                    (availabilityStatus.available === false && !availabilityStatus.owned)
                  }
                >
                  {submitting ? 'Creating...' : 
                   availabilityStatus.owned ? 'Update Subdomain' :
                   'Create Subdomain'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
      </div>
  );
}


