import { NextRequest } from 'next/server';

// Uses Cloudflare DNS-over-HTTPS JSON API to check resolution
// https://developers.cloudflare.com/1.1.1.1/dns-over-https/json-format/

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name');
  if (!name) return new Response('Missing name', { status: 400 });

  // Query A record first, then CNAME as fallback
  const endpoints = [
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=A`,
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=CNAME`,
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=AAAA`
  ];

  try {
    const results = await Promise.all(
      endpoints.map((url) => fetch(url, { headers: { accept: 'application/dns-json' }, cache: 'no-store' }).then((r) => r.json()).catch(() => null))
    );

    const answers = results
      .flatMap((r: { Answer?: unknown[] } | null) => (r && r.Answer ? r.Answer : []))
      .filter(Boolean);

    const active = Array.isArray(answers) && answers.length > 0;
    return Response.json({ name, active, answers });
  } catch {
    return new Response('DNS query failed', { status: 502 });
  }
}


