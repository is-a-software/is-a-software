import { NextRequest } from 'next/server';

export interface AuthUser {
  uid: string;
  email: string;
  githubLogin?: string;
}

export async function validateAuth(request: NextRequest): Promise<{ user: AuthUser } | { error: string; status: number }> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 };
  }

  const token = authHeader.substring(7);
  
  try {
    // Validate the Firebase ID token
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: token
      })
    });

    if (!response.ok) {
      return { error: 'Invalid token', status: 401 };
    }

    const data = await response.json();
    const user = data.users?.[0];
    
    if (!user) {
      return { error: 'User not found', status: 401 };
    }

    return { 
      user: {
        uid: user.localId,
        email: user.email,
        githubLogin: user.providerUserInfo?.find((p: { providerId: string; screenName?: string }) => p.providerId === 'github.com')?.screenName
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser | Response> {
  const authResult = await validateAuth(request);
  
  if ('error' in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }
  
  return authResult.user;
}

// Rate limiting
const rateLimitMap = new Map<string, number[]>();

export function rateLimit(identifier: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter((time: number) => now - time < windowMs);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  
  return true;
}