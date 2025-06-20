import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { text, source, target } = await request.json();
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source,
      target,
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
