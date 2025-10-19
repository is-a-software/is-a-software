import { NextRequest } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const OWNER = process.env.GITHUB_REPO_OWNER || 'is-a-software';
const REPO = process.env.GITHUB_REPO_NAME || 'is-a-software';

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
  const ownerQ = req.nextUrl.searchParams.get('owner')?.toLowerCase();
  const limit = Number(req.nextUrl.searchParams.get('limit') || 10);

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
    for (const c of commits) {
      activities.push({
        domain: f.name.replace('.json',''),
        message: c.commit?.message || 'Update',
        author: c.author?.login || c.commit?.author?.name || 'unknown',
        date: c.commit?.author?.date || c.commit?.committer?.date,
        sha: c.sha,
        html_url: c.html_url,
      });
    }
  }

  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Response.json(activities.slice(0, limit));
}


