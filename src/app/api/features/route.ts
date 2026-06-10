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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, details, username } = await request.json();
    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description required' },
        { status: 400, headers: corsHeaders }
      );
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

    return NextResponse.json({ ok: true, id: req.id }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  return NextResponse.json({ requests: featureRequests }, { headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const req = featureRequests.find((r) => r.id === id);
    if (!req) {
      return NextResponse.json(
        { error: 'not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    req.status = status;
    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
