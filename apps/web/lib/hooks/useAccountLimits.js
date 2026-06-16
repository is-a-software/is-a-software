'use client';

import { useCallback, useEffect, useState } from 'react';
import { readSessionCache, writeSessionCache } from '@/lib/auth';
import { userApi } from '@/lib/api';

const DEFAULT_LIMITS = {
  recordsUsed: 0,
  recordLimit: 0,
  githubBonus: false,
  premium: false
};
const LIMITS_CACHE_TTL_MS = 30_000;

function normalizeLimits(data) {
  return {
    recordsUsed: data?.recordsUsed ?? 0,
    recordLimit: data?.recordLimit ?? 0,
    githubBonus: !!data?.githubBonus,
    premium: !!data?.premium
  };
}

export function useAccountLimits({ enabled = true, onUnauthorized } = {}) {
  const [limits, setLimits] = useState(() => readSessionCache('limits', LIMITS_CACHE_TTL_MS) || DEFAULT_LIMITS);
  const [isLoadingLimits, setIsLoadingLimits] = useState(false);
  const [limitsError, setLimitsError] = useState('');

  const refreshLimits = useCallback(async ({ force = false } = {}) => {
    if (!force) {
      const cached = readSessionCache('limits', LIMITS_CACHE_TTL_MS);
      if (cached) {
        const normalizedCached = normalizeLimits(cached);
        setLimits(normalizedCached);
        return normalizedCached;
      }
    }

    setIsLoadingLimits(true);
    setLimitsError('');
    try {
      const res = await userApi.getLimits();
      const normalized = normalizeLimits(res);
      setLimits(normalized);
      writeSessionCache('limits', normalized);
      return normalized;
    } catch (err) {
      if (err?.status === 401 && onUnauthorized) {
        onUnauthorized();
      } else {
        setLimitsError(err?.message || 'Failed to load limits.');
      }
      throw err;
    } finally {
      setIsLoadingLimits(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    if (!enabled) return;
    refreshLimits().catch(() => {});
  }, [enabled, refreshLimits]);

  return {
    limits,
    isLoadingLimits,
    limitsError,
    setLimits,
    refreshLimits
  };
}
