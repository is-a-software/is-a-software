import { NextRequest } from 'next/server';

const RAW_DB_URL = 'https://raw.is-a.software/domains.json';

export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get('subdomain')?.toLowerCase().trim();
  
  if (!subdomain) {
    return new Response('Missing subdomain parameter', { status: 400 });
  }

  try {
    // Check if domain exists in database
    const res = await fetch(RAW_DB_URL, { cache: 'no-store' });
    if (!res.ok) {
      return new Response('Failed to fetch domain data', { status: 502 });
    }

    const domains: Array<{ domain?: string }> = await res.json();
    const domainExists = domains.find((d) => 
      d?.domain?.toLowerCase() === subdomain
    );

    if (!domainExists) {
      return Response.json({
        exists: false,
        status: 'not_found',
        message: 'Domain not found in database'
      });
    }

    // Check DNS resolution status
    const hostname = `${subdomain}.is-a.software`;
    const dnsStatus = await checkDNSStatus(hostname);

    return Response.json({
      exists: true,
      status: dnsStatus.active ? 'active' : 'pending',
      dnsStatus: dnsStatus,
      domain: domainExists,
      lastChecked: new Date().toISOString()
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Domain status API error:', error.message);
    } else {
      console.error('Domain status API error:', error);
    }
    return new Response('Failed to check domain status', { status: 500 });
  }
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
