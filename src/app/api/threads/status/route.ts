import { NextResponse } from 'next/server';
import { isConnected } from '@/lib/threads-api';

export async function GET() {
  return NextResponse.json({ connected: isConnected() });
}
