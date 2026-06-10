import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/threads-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL('/?threads_error=' + error, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?threads_error=no_code', request.url)
    );
  }

  try {
    const token = await exchangeCodeForToken(code);
    if (token) {
      return NextResponse.redirect(
        new URL('/?threads_connected=true', request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL('/?threads_error=token_exchange_failed', request.url)
      );
    }
  } catch (err) {
    return NextResponse.redirect(
      new URL('/?threads_error=exception', request.url)
    );
  }
}
