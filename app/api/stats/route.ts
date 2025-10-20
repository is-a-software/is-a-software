export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { requireAuth, rateLimit } from '@/lib/auth-middleware';

const RAW_DB_URL = 'https://raw.is-a.software/domains.json';

export async function GET(req: NextRequest) {
  // Authenticate user
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;
  
  const { githubLogin, uid } = authResult;
  
  // Rate limiting
  if (!rateLimit(`stats-${uid}`, 10, 60000)) {
    return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }
  try {
    // Fetch all domains
    const res = await fetch(RAW_DB_URL, { cache: 'no-store' });
    if (!res.ok) {
      return new Response('Upstream fetch failed', { status: 502 });
    }

    let data: Array<{ domain: string; owner?: { github?: string }; record?: Record<string, string> }>;
    try {
      data = await res.json();
    } catch {
      return new Response('Invalid upstream JSON', { status: 502 });
    }

    if (!Array.isArray(data)) {
      return new Response('Unexpected upstream format', { status: 502 });
    }

    // Filter out system files (starting with _)
    const realDomains = data.filter((d) => d?.domain && !d.domain.startsWith('_'));
    const total = realDomains.length;

    // Check DNS status for each domain to determine active/pending
    // For performance, we'll sample or use a cache strategy
    // For now, we'll do a simple check on a subset or return estimated values
    
    const owner = req.nextUrl.searchParams.get('owner')?.toLowerCase();
    
    // Only allow users to see their own stats or if they request a specific owner that matches their login
    const requestedOwner = owner || githubLogin?.toLowerCase();
    
    if (requestedOwner !== githubLogin?.toLowerCase()) {
      return Response.json({ error: 'Unauthorized: Can only view your own stats' }, { status: 403 });
    }
    
    const userDomains = realDomains.filter((d) => d?.owner?.github?.toLowerCase() === requestedOwner);

    // Check DNS status for user's domains (or all if no owner specified)
    const checkLimit = Math.min(userDomains.length, 50); // Limit concurrent checks
    const domainsToCheck = userDomains.slice(0, checkLimit);
    
    const activeChecks = await Promise.allSettled(
      domainsToCheck.map(async (d) => {
        const hostname = `${d.domain}.is-a.software`;
        try {
          const r = await fetch(
            `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`,
            { 
              headers: { accept: 'application/dns-json' },
              cache: 'no-store',
              signal: AbortSignal.timeout(5000) // 5s timeout
            }
          );
          const json = await r.json();
          return { domain: d.domain, active: Array.isArray(json?.Answer) && json.Answer.length > 0 };
        } catch {
          return { domain: d.domain, active: false };
        }
      })
    );

    const activeCount = activeChecks.filter(
      (result) => result.status === 'fulfilled' && result.value.active
    ).length;

    const pendingCount = checkLimit - activeCount;

    // Calculate unique owners
    const uniqueOwners = new Set(realDomains.map((d) => d?.owner?.github?.toLowerCase()).filter(Boolean)).size;

    // Calculate statistics
    const stats = {
      total: owner ? userDomains.length : total,
      active: activeCount,
      pending: pendingCount,
      uniqueOwners: owner ? 1 : uniqueOwners,
      // If checking subset, estimate totals
      estimated: checkLimit < userDomains.length,
      checkedCount: checkLimit
    };

    return Response.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return new Response('Failed to fetch stats', { status: 500 });
  }
}
