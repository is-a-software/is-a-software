/**
 * Custom hook for managing dashboard data
 * Centralizes all dashboard-related data fetching and state management
 */

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useApi } from './useApi';

// Type definitions for better type safety
export interface Domain {
  domain: string;
  owner: { github: string };
  record: Record<string, string>;
  proxy?: boolean;
}

export interface Activity {
  domain: string;
  message: string;
  author: string;
  date: string;
  html_url: string;
}

export interface Stats {
  total: number;
  active: number;
  pending: number;
}

interface DomainStatus {
  [hostname: string]: boolean;
}

export function useDashboardData() {
  const { user } = useAuth();
  const domainsApi = useApi<Domain[]>();
  const activityApi = useApi<Activity[]>();
  const statsApi = useApi<Stats>();

  // Local state for domain statuses and refresh functionality
  const [activeMap, setActiveMap] = useState<DomainStatus>({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Get GitHub username from user object - memoized to prevent recalculation
  const githubLogin = useMemo(() => {
    if (!user) return undefined;
    const userInfo = user as { reloadUserInfo?: { screenName?: string } } | null;
    return userInfo?.reloadUserInfo?.screenName || 
           (user?.email ? user.email.split('@')[0] : undefined);
  }, [user]);

  // Fetch domains data - optimized to avoid unnecessary calls
  const fetchDomains = useCallback(async () => {
    if (!user || !githubLogin) return;
    
    try {
      const encodedLogin = encodeURIComponent(githubLogin.toLowerCase());
      await domainsApi.execute(`/api/subdomains?owner=${encodedLogin}`);
    } catch (error) {
      console.error('Failed to fetch domains:', error);
    }
  }, [user, githubLogin, domainsApi]);

  // Fetch activity data
  const fetchActivity = useCallback(async () => {
    if (!user || !githubLogin) return;
    
    try {
      const encodedLogin = encodeURIComponent(githubLogin.toLowerCase());
      await activityApi.execute(`/api/activity?owner=${encodedLogin}`);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    }
  }, [user, githubLogin, activityApi]);

  // Fetch stats data
  const fetchStats = useCallback(async () => {
    if (!user || !githubLogin) return;
    
    try {
      const encodedLogin = encodeURIComponent(githubLogin.toLowerCase());
      await statsApi.execute(`/api/stats?owner=${encodedLogin}`);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [user, githubLogin, statsApi]);

  // Check domain statuses (ping test) - optimized for CPU/memory efficiency
  const refreshDomainStatuses = useCallback(async () => {
    if (!domainsApi.data?.length || refreshing) return;
    
    setRefreshing(true);
    const newActiveMap: DomainStatus = {};
    
    try {
      // Process domains in batches to reduce memory pressure
      const BATCH_SIZE = 5;
      const domains = domainsApi.data;
      
      for (let i = 0; i < domains.length; i += BATCH_SIZE) {
        const batch = domains.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (domain) => {
          const hostname = `${domain.domain}.is-a.software`;
          try {
            // Use AbortController for timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            await fetch(`https://${hostname}`, { 
              method: 'HEAD', 
              mode: 'no-cors',
              cache: 'no-store',
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            newActiveMap[hostname] = true;
          } catch {
            newActiveMap[hostname] = false;
          }
        });
        
        await Promise.all(batchPromises);
        // Small delay between batches to reduce CPU spike
        if (i + BATCH_SIZE < domains.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      setActiveMap(newActiveMap);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error checking domain statuses:', error);
    } finally {
      setRefreshing(false);
    }
  }, [domainsApi.data, refreshing]);

  // Delete domain with optimistic updates
  const deleteDomain = useCallback(async (domainName: string) => {
    if (!user) throw new Error('User not authenticated');

    // Use domainsApi to delete the domain
    await domainsApi.execute(`/api/subdomains/${domainName}`, { method: 'DELETE' });

    // Refresh domains after deletion
    setTimeout(() => fetchDomains(), 0);

    return { success: true };
  }, [user, domainsApi, fetchDomains]);

  // Initial data fetch on mount or user change
  useEffect(() => {
    if (user && githubLogin) {
      fetchDomains();
      fetchActivity();
      fetchStats();
    }
  }, [user, githubLogin, fetchDomains, fetchActivity, fetchStats]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchDomains(),
      fetchActivity(),
      fetchStats()
    ]);
  }, [fetchDomains, fetchActivity, fetchStats]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    // Data
    domains: domainsApi.data || [],
    activity: activityApi.data || [],
    stats: statsApi.data,
    activeMap,
    
    // Loading states
    domainsLoading: domainsApi.loading,
    activityLoading: activityApi.loading,
    statsLoading: statsApi.loading,
    refreshing,
    
    // Error states
    domainsError: domainsApi.error,
    activityError: activityApi.error,
    statsError: statsApi.error,
    
    // Actions
    refreshDomainStatuses,
    refreshAll,
    deleteDomain,
    
    // Metadata
    lastRefresh,
    githubLogin
  }), [
    domainsApi.data, domainsApi.loading, domainsApi.error,
    activityApi.data, activityApi.loading, activityApi.error,
    statsApi.data, statsApi.loading, statsApi.error,
    activeMap, refreshing, lastRefresh, githubLogin,
    refreshDomainStatuses, refreshAll, deleteDomain
  ]);
}