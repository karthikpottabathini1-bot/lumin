import { NextRequest, NextResponse } from 'next/server';

interface RedditComment {
  id: string;
  author: string;
  body: string;
  ups: number;
  created_utc: number;
  replies?: { data?: { children: { data: RedditComment }[] } };
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Reddit post URL required' }, { status: 400 });
  }

  try {
    // Convert a reddit URL to JSON API URL
    let apiUrl = url;
    if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);
    if (apiUrl.endsWith('/?')) apiUrl = apiUrl.slice(0, -2);
    if (!apiUrl.endsWith('.json')) apiUrl += '.json';

    console.log('[Reddit] Fetching:', apiUrl);

    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Lumin:v1.0 (by /u/LuminApp)',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Reddit API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const postData = data[0]?.data?.children?.[0]?.data;
    const commentsData = data[1]?.data?.children || [];

    const comments: RedditComment[] = [];
    const extractComments = (children: any[]) => {
      for (const child of children) {
        if (child.kind === 'more') continue;
        const c = child.data;
        if (c.body) {
          comments.push({
            id: c.id,
            author: c.author,
            body: c.body,
            ups: c.ups || 0,
            created_utc: c.created_utc || 0,
          });
        }
        if (c.replies?.data?.children) {
          extractComments(c.replies.data.children);
        }
      }
    };
    extractComments(commentsData);

    return NextResponse.json({
      post: {
        id: postData?.id,
        title: postData?.title,
        author: postData?.author,
        ups: postData?.ups,
        num_comments: postData?.num_comments,
        url: postData?.url,
        selftext: postData?.selftext,
      },
      comments,
    });
  } catch (err: any) {
    console.error('[Reddit] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
