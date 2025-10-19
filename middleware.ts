import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /login)
  const path = request.nextUrl.pathname;

  // Define paths that are considered public (no authentication required)
  const isPublicPath = path === '/login' || path === '/' || path.startsWith('/api/') || path.startsWith('/_next/') || path.startsWith('/favicon');

  // For serverless architecture, we let the client-side handle authentication
  // The dashboard page will check authentication status and redirect if needed
  // This middleware only handles basic route protection for static assets

  // Allow all requests to pass through - authentication is handled client-side
  return NextResponse.next();
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
