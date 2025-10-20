export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';

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
  const { name } = await params;
  if (!name) return new Response('Missing name', { status: 400 });
  const body = await req.json().catch(() => null) as { record: Record<string, string>, proxy?: boolean, user?: string } | null;
  if (!body || !body.record || typeof body.record !== 'object') {
    return new Response('Invalid body', { status: 400 });
  }

  // Load existing file to preserve owner
  const filePath = `domains/${name}.json`;
  const contents = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`);
  const existing = JSON.parse(Buffer.from(contents.content, contents.encoding || 'base64').toString('utf8'));

  const newContent = {
    owner: existing.owner,
    record: body.record,
    proxy: !!body.proxy
  };

  // Direct commit to main branch instead of creating PR
  const userOnBehalfOf = body.user || existing.owner?.github || 'unknown';
  const blob = Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64');
  const commit = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `Update: ${name}.is-a.software on behalf of @${userOnBehalfOf}`,
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
}


