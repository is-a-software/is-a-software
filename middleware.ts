import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addSecurityHeaders } from '@/lib/security-headers';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /login)
  const path = request.nextUrl.pathname;

  // Define paths that are considered public (no authentication required)
  const isPublicPath = path === '/login' || 
                      path === '/' || 
                      path === '/about' || 
                      path === '/docs' || 
                      path === '/endpoint' || 
                      path === '/privacy' || 
                      path === '/terms' ||
                      path.startsWith('/_next/') || 
                      path.startsWith('/favicon') ||
                      path.startsWith('/api/public-stats') ||
                      path.startsWith('/api/check');

  // Allow public paths
  if (isPublicPath) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Protected paths that require authentication
  const isProtectedPath = path.startsWith('/dashboard') || 
                         path.startsWith('/api/subdomains') || 
                         path.startsWith('/api/activity') || 
                         path.startsWith('/api/stats');

  if (isProtectedPath) {
    const authHeader = request.headers.get('authorization');
    const isApiRoute = path.startsWith('/api/');

    // For API routes, check for Bearer token
    if (isApiRoute) {
      if (!authHeader?.startsWith('Bearer ')) {
        return Response.json({ 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED' 
        }, { status: 401 });
      }
      // Let the API route handle token validation
      const response = NextResponse.next();
      return addSecurityHeaders(response);
    }

    // For dashboard routes, check if user has a session
    // If not authenticated, redirect to login
    const cookies = request.cookies;
    const hasSession = cookies.get('__session') || authHeader;
    
    if (!hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
