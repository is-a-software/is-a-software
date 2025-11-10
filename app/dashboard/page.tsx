"use client";

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Footer } from '@/app/components/Footer';
import { Navbar } from '@/app/components/Navbar';
import { WelcomeSection } from './components/WelcomeSection';
import { StatsCards } from './components/StatsCards';
import { QuickActions } from './components/QuickActions';
import { RecentActivity } from './components/RecentActivity';
import { DomainPortfolio } from './components/DomainPortfolio';
import { toast } from 'sonner';
import { Toaster } from '@/app/components/ui/sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [domains, setDomains] = useState<Array<{ domain: string; owner: { github: string }; record: Record<string, string> }>>([]);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [domainsError, setDomainsError] = useState('');
  const [activity, setActivity] = useState<Array<{ domain: string; message: string; author: string; date: string; html_url: string }>>([]);
  const [activityError, setActivityError] = useState('');
  const [stats, setStats] = useState<{ total: number; active: number; pending: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; domain: { domain: string } | null; deleting: boolean }>({
    open: false,
    domain: null,
    deleting: false
  });
  const hasInitiallyCheckedRef = useRef(false);

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await user?.getIdToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, [user]);

  const githubLogin = useMemo(() => {
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
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`/api/subdomains?owner=${encodeURIComponent(login)}`, { 
          cache: 'no-store',
          headers: authHeaders
        });
        if (!res.ok) throw new Error(await res.text());
        const items: Array<{ domain: string; owner: { github: string }; record: Record<string, string> }> = await res.json();
        if (!aborted) setDomains(items.map((i) => ({ domain: i.domain, owner: i.owner, record: i.record })));
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load domains';
        if (!aborted) setDomainsError(message);
      } finally {
        if (!aborted) setDomainsLoading(false);
      }
    }
    load();
    return () => { aborted = true; };
  }, [user, githubLogin, getAuthHeaders]);

  // Activity loading disabled to reduce CPU usage

  useEffect(() => {
    if (!user || !githubLogin) return;
    const login = githubLogin.toLowerCase();
    let aborted = false;
    async function load() {
      try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`/api/stats?owner=${encodeURIComponent(login)}`, { 
          cache: 'no-store',
          headers: authHeaders
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!aborted) setStats(data);
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    }
    load();
    return () => { aborted = true; };
  }, [user, githubLogin, getAuthHeaders]);

  // Domain status checking temporarily disabled to reduce CPU usage


  const handleEditDomain = (domain: { domain: string; record: Record<string, string> }) => {
    // Navigate to edit page (we'll need to create this)
    router.push(`/dashboard/subdomains/${domain.domain}/edit`);
  };

  const handleDeleteDomain = (domain: { domain: string }) => {
    setDeleteDialog({
      open: true,
      domain,
      deleting: false
    });
  };

  const confirmDeleteDomain = async () => {
    const domain = deleteDialog.domain;
    if (!domain) return;

    setDeleteDialog(prev => ({ ...prev, deleting: true }));

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`/api/subdomains/${domain.domain}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete domain');
      }

      // Remove the domain from the local state
      setDomains(prevDomains => prevDomains.filter(d => d.domain !== domain.domain));
      
      // Close dialog
      setDeleteDialog({ open: false, domain: null, deleting: false });
      
      // Show success message
      toast.success(`Successfully deleted ${domain.domain}.is-a.software`, {
        description: 'The subdomain has been removed from your account.',
      });
      
    } catch (error) {
      console.error('Error deleting domain:', error);
      toast.error('Failed to delete domain', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      // Close dialog even on error
      setDeleteDialog({ open: false, domain: null, deleting: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
      <Navbar currentPage="dashboard" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeSection userName={user.displayName} userEmail={user.email} />
        
        <StatsCards 
          stats={stats}
          domainsLoading={domainsLoading}
          domainsCount={domains.length}
          activeCount={0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <QuickActions />
          <RecentActivity activity={activity} activityError={activityError} />
        </div>

        <DomainPortfolio
          domains={domains}
          domainsLoading={domainsLoading}
          domainsError={domainsError}
          activeMap={{}}
          refreshing={false}
          lastRefresh={null}
          onRefresh={() => {}}
          onEdit={handleEditDomain}
          onDelete={handleDeleteDomain}
        />
      </main>
      
      <Footer />
      <Toaster />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, domain: null, deleting: false })}>
        <AlertDialogContent className="bg-gradient-to-br from-[#0C0C0C] to-black border-[#333333]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Subdomain</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <span className="font-mono text-red-400">{deleteDialog.domain?.domain}.is-a.software</span>?
              <br />
              <span className="text-red-400 font-medium mt-2 block">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
              disabled={deleteDialog.deleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteDomain}
              disabled={deleteDialog.deleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50"
            >
              {deleteDialog.deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
