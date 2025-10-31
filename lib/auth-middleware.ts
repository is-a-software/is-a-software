import { NextRequest } from 'next/server';

export interface AuthUser {
  uid: string;
  email: string;
  githubLogin?: string;
}

// Security constants
const MAX_CACHE_SIZE = 1000; // Prevent memory exhaustion
const MAX_RATE_LIMIT_ENTRIES = 10000;

// In-memory cache for auth tokens (Edge runtime compatible)
const authCache = new Map<string, { user: AuthUser; timestamp: number }>();
const AUTH_CACHE_TTL = 3600000; // 1 hour cache for auth tokens (Firebase tokens are valid for 1 hour)

export async function validateAuth(request: NextRequest): Promise<{ user: AuthUser } | { error: string; status: number }> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 };
  }

  const token = authHeader.substring(7);
  
  // Basic token validation
  if (!token || token.length < 10 || token.length > 2048) {
    return { error: 'Invalid token format', status: 401 };
  }

  // Check cache first
  const cached = authCache.get(token);
  if (cached && Date.now() - cached.timestamp < AUTH_CACHE_TTL) {
    return { user: cached.user };
  }
  
  // Clean expired cache entries and prevent memory exhaustion
  if (cached && Date.now() - cached.timestamp >= AUTH_CACHE_TTL) {
    authCache.delete(token);
  }
  
  // Prevent cache from growing too large
  if (authCache.size > MAX_CACHE_SIZE) {
    const oldestKey = authCache.keys().next().value;
    if (oldestKey) {
      authCache.delete(oldestKey);
    }
  }
  
  try {
    // Validate the Firebase ID token with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: token
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Don't expose specific error details
      return { error: 'Authentication failed', status: 401 };
    }

    const data = await response.json();
    const user = data.users?.[0];
    
    if (!user || !user.localId || !user.email) {
      return { error: 'Invalid user data', status: 401 };
    }

    // Sanitize user data
    const authUser: AuthUser = {
      uid: String(user.localId).slice(0, 128), // Limit length
      email: String(user.email).slice(0, 254), // RFC compliant email length
      githubLogin: user.providerUserInfo?.find((p: { providerId: string; screenName?: string }) => 
        p.providerId === 'github.com')?.screenName?.slice(0, 39) // GitHub username max length
    };
    
    // Cache the validated user
    authCache.set(token, { user: authUser, timestamp: Date.now() });

    return { user: authUser };
  } catch (error) {
    // Log error server-side but don't expose details to client
    if (process.env.NODE_ENV === 'development') {
      console.error('Authentication error:', error);
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      return { error: 'Authentication timeout', status: 408 };
    }
    
    return { error: 'Authentication service unavailable', status: 503 };
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser | Response> {
  const authResult = await validateAuth(request);
  
  if ('error' in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }
  
  return authResult.user;
}

// Enhanced rate limiting with security measures
const rateLimitMap = new Map<string, number[]>();

export function rateLimit(identifier: string, limit = 10, windowMs = 60000): boolean {
  // Sanitize identifier to prevent injection
  const safeIdentifier = String(identifier).slice(0, 128);
  
  const now = Date.now();
  const userRequests = rateLimitMap.get(safeIdentifier) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter((time: number) => now - time < windowMs);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(safeIdentifier, validRequests);
  
  // Prevent memory exhaustion - clean up old entries periodically
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    const entriesToDelete = Array.from(rateLimitMap.keys()).slice(0, Math.floor(MAX_RATE_LIMIT_ENTRIES * 0.1));
    entriesToDelete.forEach(key => rateLimitMap.delete(key));
  }
  
  return true;
}

// Enhanced rate limiting with stricter limits for suspicious behavior
export function strictRateLimit(identifier: string): boolean {
  return rateLimit(`strict_${identifier}`, 5, 300000); // 5 requests per 5 minutes
}

// Get client IP for rate limiting
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  return 'unknown';
}