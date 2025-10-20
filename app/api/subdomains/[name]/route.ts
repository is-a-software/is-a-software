export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { requireAuth, rateLimit } from '@/lib/auth-middleware';
import { validateDNSRecord, type DNSRecordType } from '@/lib/dns-validation';

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  // Authenticate user
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;
  
  const { githubLogin, uid } = authResult;
  const { name } = await params;
  
  if (!name) {
    return Response.json({ error: 'Missing domain name' }, { status: 400 });
  }

  // Rate limiting
  if (!rateLimit(`dns-edit-${uid}`, 5, 60000)) {
    return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const body = await req.json().catch(() => null) as { record: Record<string, string>, proxy?: boolean } | null;
    if (!body || !body.record || typeof body.record !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const recordType = Object.keys(body.record)[0] as DNSRecordType;
    const recordValue = body.record[recordType];
    
    // Server-side DNS validation
    const validation = validateDNSRecord(recordType, recordValue);
    if (!validation.isValid) {
      return Response.json({ error: `Invalid DNS record: ${validation.message}` }, { status: 400 });
    }

    // Load existing file to check ownership
    const filePath = `domains/${name}.json`;
    const contents = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`);
    const existing = JSON.parse(Buffer.from(contents.content, contents.encoding || 'base64').toString('utf8'));

    // Verify ownership
    if (!existing.owner?.github || existing.owner.github.toLowerCase() !== githubLogin?.toLowerCase()) {
      return Response.json({ error: 'Unauthorized: You do not own this domain' }, { status: 403 });
    }

    const newContent = {
      owner: existing.owner,
      record: body.record,
      proxy: !!body.proxy
    };

    // Direct commit to main branch
    const blob = Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64');
    const commit = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Update: ${name}.is-a.software on behalf of @${githubLogin}`,
        content: blob,
        branch: 'main',
        sha: contents.sha,
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

    return Response.json({
      success: true,
      commit: commit.commit,
      message: 'DNS record updated successfully'
    });

  } catch (error: unknown) {
    console.error('DNS update error:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        return Response.json({ error: 'Domain not found' }, { status: 404 });
      } else if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
        return Response.json({ error: 'Access denied' }, { status: 403 });
      }
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  // Authenticate user
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;
  
  const { githubLogin, uid } = authResult;
  const { name } = await params;
  
  if (!name) {
    return Response.json({ error: 'Missing domain name' }, { status: 400 });
  }

  // Rate limiting for deletion (stricter than edits)
  if (!rateLimit(`dns-delete-${uid}`, 3, 60000)) {
    return Response.json({ error: 'Too many deletion requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    // Load existing file to check ownership
    const filePath = `domains/${name}.json`;
    const contents = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`);
    const existing = JSON.parse(Buffer.from(contents.content, contents.encoding || 'base64').toString('utf8'));

    // Verify ownership
    if (!existing.owner?.github || existing.owner.github.toLowerCase() !== githubLogin?.toLowerCase()) {
      return Response.json({ error: 'Unauthorized: You do not own this domain' }, { status: 403 });
    }

    // Delete the file by committing an empty commit with delete
    await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete: ${name}.is-a.software on behalf of @${githubLogin}`,
        sha: contents.sha,
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

    return Response.json({
      success: true,
      message: 'Domain deleted successfully'
    });

  } catch (error: unknown) {
    console.error('DNS deletion error:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        return Response.json({ error: 'Domain not found' }, { status: 404 });
      } else if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
        return Response.json({ error: 'Access denied' }, { status: 403 });
      }
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

