import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!WEBHOOK_URL) {
      console.error('DISCORD_WEBHOOK_URL not configured');
      return NextResponse.json({ error: 'Service not configured' }, { status: 500 });
    }

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: null,
        embeds: [{
          title: 'New Waitlist Signup',
          color: 0x58b9ff,
          fields: [{ name: 'Email', value: email }],
          timestamp: new Date().toISOString(),
        }],
      }),
    });

    if (!res.ok) {
      console.error('Discord webhook failed:', await res.text());
      return NextResponse.json({ error: 'Failed to notify' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
