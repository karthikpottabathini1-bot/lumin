import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/threads-api';

export async function GET() {
  const authUrl = getAuthUrl();
  if (!authUrl) {
    return NextResponse.json(
      { error: 'Meta App not configured. Set META_APP_ID and META_APP_SECRET in .env.local' },
      { status: 400 }
    );
  }
  return NextResponse.json({ url: authUrl });
}
