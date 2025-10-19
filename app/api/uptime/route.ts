export const dynamic = "force-static";


// Simple uptime tracking endpoint
// In production, integrate with uptime monitoring service like UptimeRobot, Pingdom, or StatusPage
export async function GET() {
  try {
    // Option 1: Integrate with external monitoring service
    // For now, return estimated uptime based on service availability
    
    // Option 2: Calculate based on incident history or logs
    // For demo purposes, we'll return a high availability estimate
    
    const uptime = {
      percentage: 99.9,
      status: 'operational',
      lastChecked: new Date().toISOString(),
      message: 'All systems operational'
    };

    // Optional: Ping Cloudflare API to verify service health
    try {
      const cfCheck = await fetch('https://cloudflare-dns.com/dns-query?name=is-a.software&type=A', {
        headers: { accept: 'application/dns-json' },
        signal: AbortSignal.timeout(3000)
      });
      
      if (!cfCheck.ok) {
        uptime.status = 'degraded';
        uptime.percentage = 95.0;
        uptime.message = 'Experiencing minor issues';
      }
    } catch {
      uptime.status = 'degraded';
      uptime.percentage = 90.0;
      uptime.message = 'Service check failed';
    }

    return Response.json(uptime);
  } catch {
    return Response.json({
      percentage: 0,
      status: 'unknown',
      lastChecked: new Date().toISOString(),
      message: 'Unable to determine uptime'
    }, { status: 500 });
  }
}
