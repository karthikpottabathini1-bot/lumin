import { cookies } from 'next/headers';

const META_APP_ID = process.env.META_APP_ID || '';
const META_APP_SECRET = process.env.META_APP_SECRET || '';
const REDIRECT_URI = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/threads/callback`
  : process.env.THREADS_REDIRECT_URI || 'http://localhost:3000/api/threads/callback';

const THREADS_AUTH_URL = 'https://www.threads.net/oauth/authorize';
const THREADS_TOKEN_URL = 'https://graph.threads.net/oauth/access_token';
const THREADS_REFRESH_URL = 'https://graph.threads.net/refresh_access_token';
const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

interface ThreadsToken {
  access_token: string;
  user_id: string;
  expires_at: number;
  refresh_token?: string;
}

let cachedToken: ThreadsToken | null = null;

const TOKEN_FILE = '/tmp/lumin-threads-token.json';

function loadToken(): ThreadsToken | null {
  if (cachedToken && cachedToken.expires_at > Date.now()) return cachedToken;
  try {
    const fs = require('fs');
    if (fs.existsSync(TOKEN_FILE)) {
      const raw = fs.readFileSync(TOKEN_FILE, 'utf-8');
      cachedToken = JSON.parse(raw);
      if (cachedToken && cachedToken.expires_at > Date.now()) return cachedToken;
    }
  } catch {}
  return null;
}

function saveToken(token: ThreadsToken) {
  cachedToken = token;
  try {
    const fs = require('fs');
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(token));
  } catch {}
}

export function getAuthUrl(): string {
  if (!META_APP_ID) return '';
  const params = new URLSearchParams({
    client_id: META_APP_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'threads_basic',
  });
  return `${THREADS_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<ThreadsToken | null> {
  try {
    const body = new URLSearchParams({
      client_id: META_APP_ID,
      client_secret: META_APP_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    });

    const res = await fetch(
      `${THREADS_TOKEN_URL}?${body.toString()}`,
      { method: 'POST' }
    );
    const data = await res.json();

    if (data.access_token) {
      const token: ThreadsToken = {
        access_token: data.access_token,
        user_id: data.user_id,
        expires_at: Date.now() + (data.expires_in ? data.expires_in * 1000 : 3600000),
      };

      // Exchange for long-lived token
      const longLived = await getLongLivedToken(token.access_token);
      if (longLived) {
        token.access_token = longLived.access_token;
        token.expires_at = longLived.expires_at;
      }

      saveToken(token);
      return token;
    }
    return null;
  } catch (err) {
    console.error('[Threads] Token exchange error:', err);
    return null;
  }
}

async function getLongLivedToken(shortToken: string): Promise<{ access_token: string; expires_at: number } | null> {
  try {
    const params = new URLSearchParams({
      grant_type: 'th_exchange_token',
      client_secret: META_APP_SECRET,
      access_token: shortToken,
    });
    const res = await fetch(`${THREADS_REFRESH_URL}?${params.toString()}`);
    const data = await res.json();
    if (data.access_token) {
      return {
        access_token: data.access_token,
        expires_at: Date.now() + (data.expires_in || 5184000) * 1000, // ~60 days
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function isConnected(): boolean {
  const token = loadToken();
  return token !== null && token.expires_at > Date.now();
}

export function getToken(): string | null {
  const token = loadToken();
  return token?.access_token || null;
}

export async function fetchUserThreads(limit = 5): Promise<any[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const url = `${THREADS_API_BASE}/me/threads?fields=id,text,timestamp,permalink,like_count,reply_count&limit=${limit}&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('[Threads] Fetch threads error:', err);
    return [];
  }
}

export async function fetchThreadReplies(threadId: string): Promise<any[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const url = `${THREADS_API_BASE}/${threadId}/replies?fields=id,text,timestamp,username,like_count&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('[Threads] Fetch replies error:', err);
    return [];
  }
}

export async function checkForNewReplies(threadId: string, sinceTimestamp: number): Promise<any[]> {
  const replies = await fetchThreadReplies(threadId);
  return replies.filter((r: any) => {
    const replyTime = new Date(r.timestamp).getTime();
    return replyTime > sinceTimestamp;
  });
}
