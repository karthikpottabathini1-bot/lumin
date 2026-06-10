import { NextRequest, NextResponse } from 'next/server';

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  details: string;
  username: string;
  status: 'new' | 'approved' | 'rejected';
  createdAt: string;
}

let featureRequests: FeatureRequest[] = [];

export async function POST(request: NextRequest) {
  try {
    const { title, description, details, username } = await request.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'title and description required' }, { status: 400 });
    }

    const req: FeatureRequest = {
      id: `fr_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      details: (details || description).trim(),
      username: username || 'anonymous',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    featureRequests.unshift(req);
    console.log('[Features] New request:', req.title);

    return NextResponse.json({ ok: true, id: req.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ requests: featureRequests });
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const req = featureRequests.find((r) => r.id === id);
    if (!req) return NextResponse.json({ error: 'not found' }, { status: 404 });
    req.status = status;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
