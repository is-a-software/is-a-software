export const runtime = "edge";
import { NextRequest } from 'next/server';
import { requireAuth, rateLimit } from '@/lib/auth-middleware';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'is-a-software';
const REPO = 'is-a-software';

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

export async function GET(req: NextRequest) {
  // Authenticate user
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;
  
  const { githubLogin, uid } = authResult;
  
  // Rate limiting for availability checks (more lenient)
  if (!rateLimit(`subdomain-check-${uid}`, 10, 60000)) {
    return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  const name = req.nextUrl.searchParams.get('name');
  
  if (!name || name.length === 0) {
    return Response.json({ error: 'Subdomain name is required' }, { status: 400 });
  }

  // Basic validation
  if (name.length > 63) {
    return Response.json({ 
      available: false, 
      reason: 'Subdomain name cannot exceed 63 characters' 
    });
  }

  try {
    const filePath = `domains/${name}.json`;
    
    // Check if domain already exists
    let existingFile;
    try {
      existingFile = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`);
    } catch (error) {
      // File doesn't exist, domain is available
      if (error instanceof Error && error.message.includes('404')) {
        return Response.json({ 
          available: true, 
          reason: 'Subdomain is available' 
        });
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
        // User owns the domain
        return Response.json({ 
          available: false, 
          owned: true,
          reason: 'You already own this subdomain',
          editUrl: `/dashboard/subdomains/${name}/edit`
        });
      } else {
        // Domain owned by someone else
        return Response.json({ 
          available: false, 
          owned: false,
          reason: 'Subdomain is already taken by another user'
        });
      }
    }
    
    // Fallback - shouldn't reach here
    return Response.json({ 
      available: true, 
      reason: 'Subdomain is available' 
    });
    
  } catch (error: unknown) {
    console.error('Subdomain check error:', error);
    return Response.json({ error: 'Failed to check subdomain availability' }, { status: 500 });
  }
}