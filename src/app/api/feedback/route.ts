import { NextRequest, NextResponse } from 'next/server';

const feedbackStore: { username: string; avatar: string; content: string; timestamp: string }[] = [];

// Lumin's feedback receiving API — HabitOS posts here
export async function POST(request: NextRequest) {
  try {
    const { username, content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 });
    }

    const avatar = (username || 'an').slice(0, 2).toUpperCase();
    const entry = {
      username: username || 'anonymous',
      avatar,
      content: content.trim(),
      timestamp: 'Just now',
    };

    feedbackStore.push(entry);
    console.log('[Feedback] Received:', entry.content);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ feedback: feedbackStore });
}
