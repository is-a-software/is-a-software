export const runtime = "edge";
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get('subdomain')?.toLowerCase().trim();
  
  if (!subdomain) {
    return new Response('Missing subdomain parameter', { status: 400 });
  }

  // Domain status checking temporarily disabled to reduce CPU usage
  return Response.json({
    exists: true,
    status: 'pending',
    message: 'Status checking temporarily disabled',
    lastChecked: new Date().toISOString()
  });
}

async function checkDNSStatus(hostname: string): Promise<{
  active: boolean;
  answers: unknown[];
  checkedAt: string;
  error?: string;
}> {
  const endpoints = [
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`,
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=CNAME`,
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=AAAA`
  ];

  try {
    const results = await Promise.all(
      endpoints.map((url) => 
        fetch(url, { 
          headers: { accept: 'application/dns-json' }, 
          cache: 'no-store',
          signal: AbortSignal.timeout(5000) // 5s timeout
        }).then((r) => r.json()).catch(() => null)
      )
    );

    const answers = results
      .flatMap((r) => (r && Array.isArray((r as { Answer?: unknown[] }).Answer) ? (r as { Answer: unknown[] }).Answer : []))
      .filter(Boolean);

    return {
      active: Array.isArray(answers) && answers.length > 0,
      answers: answers,
      checkedAt: new Date().toISOString()
    };
  } catch {
    return {
      active: false,
      answers: [],
      error: 'DNS check failed',
      checkedAt: new Date().toISOString()
    };
  }
}
