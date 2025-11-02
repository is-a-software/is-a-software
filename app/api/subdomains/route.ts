export const runtime = "edge";
import { NextRequest } from 'next/server';
import { requireAuth, rateLimit } from '@/lib/auth-middleware';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'is-a-software';
const REPO = 'is-a-software';

const RAW_DB_URL = 'https://raw.is-a.software/domains.json';

// Cache for raw data to reduce external API calls
type DomainData = Array<{ domain?: string; owner?: { github?: string }; record?: Record<string, string> }>;
const dataCache = new Map<string, { data: DomainData; timestamp: number }>();
const DATA_CACHE_TTL = 300000; // 5 minutes cache for domain listings (reasonable balance for data freshness)

export async function GET(req: NextRequest) {
  // Authenticate user
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;
  
  const { githubLogin, uid } = authResult;
  
  // Rate limiting
  if (!rateLimit(`subdomains-${uid}`, 20, 60000)) {
    return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  const owner = req.nextUrl.searchParams.get('owner')?.toLowerCase();

  // Check cache first
  const cacheKey = RAW_DB_URL;
  let data: DomainData;
  
  const cached = dataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < DATA_CACHE_TTL) {
    data = cached.data;
  } else {
    // Clean expired cache
    if (cached) dataCache.delete(cacheKey);
    
    const res = await fetch(RAW_DB_URL, { cache: 'no-store' });
    if (!res.ok) {
      return new Response('Upstream fetch failed', { status: 502 });
    }

    try {
      data = await res.json();
    } catch {
      return new Response('Invalid upstream JSON', { status: 502 });
    }

    if (!Array.isArray(data)) {
      return new Response('Unexpected upstream format', { status: 502 });
    }
    
    // Cache the data
    dataCache.set(cacheKey, { data, timestamp: Date.now() });
  }

  // Only allow users to see their own domains or if they request a specific owner that matches their login
  const requestedOwner = owner || githubLogin?.toLowerCase();
  
  if (requestedOwner !== githubLogin?.toLowerCase()) {
    return Response.json({ error: 'Unauthorized: Can only view your own domains' }, { status: 403 });
  }

  const items = data.filter((d) => d?.owner?.github?.toLowerCase() === requestedOwner);

  return Response.json(items);
}

async function gh(path: string, init?: RequestInit) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function POST(req: NextRequest) {
  // Authenticate user
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;
  
  const { githubLogin, uid } = authResult;
  
  // Rate limiting for domain registration (stricter)
  if (!rateLimit(`domain-register-${uid}`, 2, 60000)) {
    return Response.json({ error: 'Too many registration requests. Please wait a moment.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null) as { name: string; ownerGithub: string; record: Record<string, string> } | null;
  if (!body || !body.name || !body.ownerGithub || !body.record) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Verify the requesting user matches the owner
  if (body.ownerGithub.toLowerCase() !== githubLogin?.toLowerCase()) {
    return Response.json({ error: 'Unauthorized: You can only register domains for yourself' }, { status: 403 });
  }

  try {
    const filePath = `domains/${body.name}.json`;
    
    // Check if domain already exists
    let existingFile;
    try {
      existingFile = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`);
    } catch (error) {
      // File doesn't exist, which is what we want for new domains
      if (error instanceof Error && error.message.includes('404')) {
        existingFile = null;
      } else {
        throw error;
      }
    }
    
    if (existingFile) {
      // Domain exists, check ownership
      const existingContent = Buffer.from(existingFile.content, 'base64').toString('utf-8');
      const existingData = JSON.parse(existingContent);
      const existingOwner = existingData?.owner?.github?.toLowerCase();
      
      if (existingOwner === githubLogin?.toLowerCase()) {
        // User owns the domain, suggest editing instead
        return Response.json({ 
          error: 'You already own this subdomain. Would you like to edit it instead?',
          code: 'OWNED_BY_USER',
          editUrl: `/dashboard/subdomains/${body.name}/edit`
        }, { status: 409 });
      } else {
        // Domain owned by someone else
        return Response.json({ 
          error: `Subdomain "${body.name}" is already taken. Try another one!`,
          code: 'ALREADY_TAKEN'
        }, { status: 409 });
      }
    }
    
    const content = {
      owner: { github: body.ownerGithub },
      record: body.record
    };
    
    const blob = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
    const result = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        message: `Register: ${body.name}.is-a.software on behalf of @${body.ownerGithub}`, 
        content: blob, 
        branch: 'main',
        committer: {
          name: 'priyanshbot',
          email: '129733067+priyanshbot@users.noreply.github.com'
        },
        author: {
          name: 'priyanshbot',
          email: '129733067+priyanshbot@users.noreply.github.com'
        }
      })
    });

    // Clear data cache after successful registration
    dataCache.clear();

    return Response.json({ success: true, commit: result });
  } catch (error: unknown) {
    console.error('Domain registration error:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('already exists') || errorMessage.includes('422')) {
        return Response.json({ error: 'Domain already exists' }, { status: 409 });
      } else if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
        return Response.json({ error: 'Access denied' }, { status: 403 });
      }
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}


