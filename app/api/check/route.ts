import { NextRequest } from 'next/server';

const RAW_DB_URL = 'https://raw.is-a.software/domains.json';

export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get('subdomain')?.toLowerCase().trim();
  
  if (!subdomain) {
    return new Response('Missing subdomain parameter', { status: 400 });
  }

  // Check if subdomain is reserved
  const reservedKeywords = [
    "admin", "api", "abuse", "blog", "cloudflare", "contact", "dev", "docs", 
    "email", "ftp", "git", "github", "google", "help", "imap", "is-a-software", 
    "mail", "ns1", "ns2", "owner", "pop", "shop", "smtp", "status", "support", 
    "test", "webmail", "community", "info", "career", "@", "is-a"
  ];

  if (reservedKeywords.includes(subdomain)) {
    return Response.json({
      available: false,
      reserved: true,
      message: `"${subdomain}" is a reserved keyword`
    });
  }

  try {
    // Fetch all domains
    const res = await fetch(RAW_DB_URL, { cache: 'no-store' });
    if (!res.ok) {
      return new Response('Failed to fetch domain data', { status: 502 });
    }

    const domains: Array<{ domain?: string; owner?: { github?: string }; record?: Record<string, string> }> = await res.json();
    
    // Check if subdomain exists
    const existingDomain = domains.find((d) => 
      d?.domain?.toLowerCase() === subdomain
    );

    if (existingDomain) {
      // Domain is taken, return owner info
      return Response.json({
        available: false,
        reserved: false,
        owner: {
          github: existingDomain.owner?.github,
          profileUrl: `https://github.com/${existingDomain.owner?.github}`
        },
        domain: existingDomain.domain,
        record: existingDomain.record
      });
    }

    // Domain is available
    return Response.json({
      available: true,
      reserved: false,
      subdomain: subdomain
    });

  } catch (error) {
    console.error('Check API error:', error);
    return new Response('Failed to check subdomain availability', { status: 500 });
  }
}
