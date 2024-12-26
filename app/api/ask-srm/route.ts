import { NextResponse } from 'next/server';

const API_KEY = '0605abbf84f221eb20386acef85a6f02654b003b66158ea27a93ad0a533e30cb';
const API_URL = 'https://api.together.xyz/inference';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: `You are an AI assistant for SRM University AP. You have access to information from srmap.edu.in and should provide accurate, helpful responses about the university.

Question: ${query}

Please provide a clear, concise response based on the available information from SRM AP's website.

Response:`,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return NextResponse.json({ response: data.output.choices[0].text.trim() });
  } catch (error) {
    console.error('Error in AI response:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
} 