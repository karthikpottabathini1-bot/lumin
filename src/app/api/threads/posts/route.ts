import { NextRequest, NextResponse } from 'next/server';
import { fetchUserThreads, fetchThreadReplies } from '@/lib/threads-api';

export async function GET(request: NextRequest) {
  const threadId = request.nextUrl.searchParams.get('threadId');

  if (threadId) {
    const replies = await fetchThreadReplies(threadId);
    return NextResponse.json({ replies });
  }

  const threads = await fetchUserThreads();
  return NextResponse.json({ threads });
}
