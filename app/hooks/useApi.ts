/**
 * Custom hook for making authenticated API calls
 * Provides consistent error handling and loading states across the application
 */

import { useCallback, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiOptions {
  cache?: RequestCache;
  method?: string;
  body?: Record<string, unknown>;
}

export function useApi<T = unknown>() {
  const { user } = useAuth();
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await user?.getIdToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }, [user]);

  const execute = useCallback(async (
    url: string,
    options: ApiOptions = {}
  ): Promise<T | null> => {
    // Use object update pattern to avoid creating new objects unnecessarily
    setState(prev => prev.loading ? prev : { ...prev, loading: true, error: null });
    
    try {
      const authHeaders = await getAuthHeaders();
      
      // Optimize fetch options creation - avoid object spread when possible
      const fetchOptions: RequestInit = {
        cache: 'no-store',
        method: options.method || 'GET',
        headers: authHeaders
      };
      
      // Only add body-related options when needed
      if (options.body) {
        fetchOptions.headers = { ...authHeaders, 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setState(prev => ({ ...prev, data, loading: false, error: null }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, [getAuthHeaders]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}