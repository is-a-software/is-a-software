import { NextRequest } from 'next/server';
import { requireAuth, rateLimit } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
  // Authenticate user
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;
  
  const { githubLogin, uid } = authResult;
  
  // Rate limiting
  if (!rateLimit(`activity-${uid}`, 15, 60000)) {
    return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  const ownerQ = req.nextUrl.searchParams.get('owner')?.toLowerCase();
  const requestedOwner = ownerQ || githubLogin?.toLowerCase();
  
  if (requestedOwner !== githubLogin?.toLowerCase()) {
    return Response.json({ error: 'Unauthorized: Can only view your own activity' }, { status: 403 });
  }

  // Activity feature temporarily disabled to reduce CPU usage
  return Response.json([]);
}


