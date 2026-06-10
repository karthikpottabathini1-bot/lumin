import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { request: featureRequest, answers } = await request.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured', question: '' }, { status: 400 });
    }

    const conversation = [
      { role: 'user', content: featureRequest },
    ];
    if (answers && answers.length > 0) {
      const qa = [
        "Great! Can you describe what problem this solves for you?",
        "How would you like this to work? Any specific examples?",
        "On a scale of 1-10, how important is this?",
      ];
      answers.forEach((answer: string, i: number) => {
        if (i < qa.length) {
          conversation.push({ role: 'assistant', content: qa[i] });
          conversation.push({ role: 'user', content: answer });
        }
      });
    }

    const systemPrompt = `You are Lumin, an AI product manager that helps users clarify feature requests. 
Given the conversation so far, generate ONE concise follow-up question to better understand what they want. 
The question should be specific, helpful, and conversational. Max 20 words. 
If the request is already clear enough, respond with "DONE" and nothing else.`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lumin-dun.vercel.app',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversation,
        ],
        max_tokens: 60,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';

    if (text.toUpperCase() === 'DONE') {
      return NextResponse.json({ done: true, question: null });
    }

    return NextResponse.json({ done: false, question: text });
  } catch (err: any) {
    console.error('[AI Follow-up] Error:', err);
    return NextResponse.json({ error: err.message, question: '' }, { status: 500 });
  }
}
