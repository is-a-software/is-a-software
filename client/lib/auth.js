// lib/auth.js - Client-side authentication utilities

const TOKEN_KEY = 'is_a_software_token';
const USER_KEY = 'is_a_software_user';
const CACHE_PREFIX = 'is_a_software_cache';

function getCacheStorageKey(key, token) {
  return `${CACHE_PREFIX}:${token || 'guest'}:${key}`;
}

/**
 * Get stored token from localStorage
 */
export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Store token in localStorage
 */
export function setToken(token) {
  if (typeof window !== 'undefined') {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (currentToken && currentToken !== token) {
      clearSessionCache();
    }
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Remove token from localStorage
 */
export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    clearSessionCache();
  }
}

/**
 * Get stored user from localStorage
 */
export function getUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
}

/**
 * Store user in localStorage
 */
export function setUser(user) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/**
 * Remove user from localStorage
 */
export function clearUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

export function readSessionCache(key, maxAgeMs = 60_000, tokenOverride = null) {
  if (typeof window === 'undefined') return null;

  const token = tokenOverride || getToken();
  if (!token) return null;

  try {
    const raw = localStorage.getItem(getCacheStorageKey(key, token));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const isExpired = !parsed?.savedAt || Date.now() - parsed.savedAt > maxAgeMs;
    if (isExpired) {
      localStorage.removeItem(getCacheStorageKey(key, token));
      return null;
    }

    return parsed.value ?? null;
  } catch {
    return null;
  }
}

export function writeSessionCache(key, value, tokenOverride = null) {
  if (typeof window === 'undefined') return;

  const token = tokenOverride || getToken();
  if (!token) return;

  try {
    localStorage.setItem(
      getCacheStorageKey(key, token),
      JSON.stringify({
        savedAt: Date.now(),
        value
      })
    );
  } catch {
    // ignore storage issues
  }
}

export function clearSessionCache() {
  if (typeof window === 'undefined') return;

  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${CACHE_PREFIX}:`)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Logout user
 */
export function logout() {
  clearToken();
  clearUser();
}

const PENDING_CLAIM_KEY = 'is_a_software_pending_claim';

/** Remembers a subdomain the visitor checked on the landing page, across the sign-in redirect. */
export function savePendingClaim(subdomain) {
  try {
    sessionStorage.setItem(PENDING_CLAIM_KEY, subdomain);
  } catch {
    // storage unavailable: the visitor just types the name again
  }
}

/** Returns the remembered subdomain once, then forgets it. */
export function takePendingClaim() {
  try {
    const value = sessionStorage.getItem(PENDING_CLAIM_KEY);
    sessionStorage.removeItem(PENDING_CLAIM_KEY);
    return value || '';
  } catch {
    return '';
  }
}
