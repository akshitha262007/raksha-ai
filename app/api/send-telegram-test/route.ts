import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, message } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN || '7482910482:AAHx_RakshaAIDemoBotTokenPlaceholder';
    const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;

    if (!targetChatId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Telegram Chat ID is required. Search @userinfobot on Telegram to get your Chat ID.' 
        },
        { status: 400 }
      );
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: message || '🚨 RAKSHA AI — EXTREME LANDSLIDE WARNING\n\nLocation: Zone 4 (Tawang Sector 4)\nStatus: Critical Slope Instability\n\n⚠️ DEMONSTRATION ALERT — NOT A REAL EMERGENCY.',
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      return NextResponse.json({
        success: true,
        messageId: `tg-msg-${data.result.message_id}`,
        status: 'Delivered',
        timestamp: new Date().toLocaleTimeString(),
        provider: 'Telegram Bot API (100% Free Instant Alert)'
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Telegram API Error: ${data.description || 'Failed to dispatch message.'}` },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Server error processing Telegram alert: ${err?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
