import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_TELEGRAM_API_URL = 'https://api.telegram.org/';

export async function POST(request: NextRequest) {

  const apiUrl = `${DEFAULT_TELEGRAM_API_URL}bot${process.env.BOT_TOKEN}/sendMessage`;
  const body = await request.json();
  const formattedText = `<b>Благодарность</b>
  <pre>${body.message}</pre>`;

  const payload = {
    chat_id: process.env.PERSONAL_ID,
    text: formattedText,
    disable_web_page_preview: true,
    parse_mode: 'html',
  };

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    return NextResponse.json({ status: data?.ok, });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
