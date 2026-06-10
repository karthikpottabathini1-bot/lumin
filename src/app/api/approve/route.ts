import { NextRequest, NextResponse } from 'next/server';
import { executePipeline } from '@/lib/pipeline-runner';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestTitle } = body;

    if (!requestTitle) {
      return NextResponse.json(
        { error: 'requestTitle is required' },
        { status: 400 }
      );
    }

    console.log(`[Pipeline] Starting pipeline for: ${requestTitle}`);

    const result = await executePipeline(requestTitle);

    console.log(`[Pipeline] Result:`, result);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error: any) {
    console.error(`[Pipeline] Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
