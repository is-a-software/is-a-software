export const runtime = "edge";
export const dynamic = "force-static";
import { NextRequest } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'is-a-software';
const REPO = 'is-a-software';

const RAW_DB_URL = 'https://raw.is-a.software/domains.json';

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get('owner')?.toLowerCase();

  const res = await fetch(RAW_DB_URL, { cache: 'no-store' });
  if (!res.ok) {
    return new Response('Upstream fetch failed', { status: 502 });
  }

  let data: Array<{ domain?: string; owner?: { github?: string }; record?: Record<string, string> }>;
  try {
    data = await res.json();
  } catch {
    return new Response('Invalid upstream JSON', { status: 502 });
  }

  if (!Array.isArray(data)) {
    return new Response('Unexpected upstream format', { status: 502 });
  }

  const items = owner
    ? data.filter((d) => d?.owner?.github?.toLowerCase() === owner)
    : data;

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
  const body = await req.json().catch(() => null) as { name: string; ownerGithub: string; record: Record<string, string>; proxy?: boolean } | null;
  if (!body || !body.name || !body.ownerGithub || !body.record) {
    return new Response('Invalid body', { status: 400 });
  }

  const filePath = `domains/${body.name}.json`;
  const content = {
    owner: { github: body.ownerGithub },
    record: body.record,
    proxy: !!body.proxy
  };
  const blob = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
  const result = await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`, {
    method: 'PUT',
    body: JSON.stringify({ 
      message: `Register: ${body.name}.is-a.software`, 
      content: blob, 
      branch: 'main'
    })
  });

  return Response.json({ success: true, commit: result });
}


