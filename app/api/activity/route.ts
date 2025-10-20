export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { requireAuth, rateLimit } from '@/lib/auth-middleware';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'is-a-software';
const REPO = 'is-a-software';

// Cache for activity data (activity updates less frequently)
const activityCache = new Map<string, { data: unknown; timestamp: number }>();
const ACTIVITY_CACHE_TTL = 120000; // 2 minutes cache for activity (balance between freshness and performance)

async function gh(path: string) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

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
  const limit = Number(req.nextUrl.searchParams.get('limit') || 10);
  
  // Only allow users to see their own activity or if they request a specific owner that matches their login
  const requestedOwner = ownerQ || githubLogin?.toLowerCase();
  
  if (requestedOwner !== githubLogin?.toLowerCase()) {
    return Response.json({ error: 'Unauthorized: Can only view your own activity' }, { status: 403 });
  }

  // Check cache first
  const cacheKey = `activity-${requestedOwner}-${limit}`;
  const cached = activityCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < ACTIVITY_CACHE_TTL) {
    return Response.json(cached.data);
  }
  
  // Clean expired cache
  if (cached) activityCache.delete(cacheKey);

  // List files under domains and filter to owner's domains
  const perPage = 100;
  let page = 1;
  const domainFiles: Array<{ type: string; name: string; download_url: string }> = [];
  while (true) {
    const list = await gh(`/repos/${OWNER}/${REPO}/contents/domains?per_page=${perPage}&page=${page}`);
    if (!Array.isArray(list) || list.length === 0) break;
    for (const f of list) {
      if (f.type === 'file' && f.name.endsWith('.json')) {
        if (!ownerQ) domainFiles.push(f);
        else {
          const j = await fetch(f.download_url, { cache: 'no-store' }).then(r => r.json()).catch(() => null);
          if (j?.owner?.github?.toLowerCase() === ownerQ) domainFiles.push(f);
        }
      }
    }
    if (list.length < perPage) break;
    page++;
  }

  // For each file, fetch recent commits touching it
  const activities: Array<{ domain: string; message: string; author: string; date: string; sha: string; html_url: string }>= [];
  for (const f of domainFiles) {
    const filePath = `domains/${f.name}`;
    const commits = await gh(`/repos/${OWNER}/${REPO}/commits?path=${encodeURIComponent(filePath)}&per_page=3`);
    
    // Get the domain owner to check if activity is owner-related
    const domainData = await fetch(f.download_url, { cache: 'no-store' }).then(r => r.json()).catch(() => null);
    const domainOwner = domainData?.owner?.github?.toLowerCase();
    
    for (const c of commits) {
      const commitAuthor = c.author?.login || c.commit?.author?.name || 'unknown';
      const commitAuthorLower = commitAuthor.toLowerCase();
      
      // Include activity if:
      // 1. Author is the domain owner directly, OR  
      // 2. Author is a bot acting on behalf of the owner (like priyanshbot doing automated registrations)
      const isOwnerActivity = commitAuthorLower === domainOwner;
      const isBotActivity = commitAuthor === 'priyanshbot' || commitAuthor.includes('bot');
      
      if (isOwnerActivity || isBotActivity) {
        activities.push({
          domain: f.name.replace('.json',''),
          message: c.commit?.message || 'Update',
          author: commitAuthor,
          date: c.commit?.author?.date || c.commit?.committer?.date,
          sha: c.sha,
          html_url: c.html_url,
        });
      }
    }
  }

  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const result = activities.slice(0, limit);
  
  // Cache the result
  activityCache.set(cacheKey, { data: result, timestamp: Date.now() });
  
  return Response.json(result);
}


