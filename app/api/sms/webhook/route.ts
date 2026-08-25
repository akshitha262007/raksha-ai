import { NextRequest, NextResponse } from 'next/server';

/**
 * Raksha AI — SMS Provider Delivery Webhook
 * Handles callback updates from provider (Twilio / Generic SMS HTTP Callback)
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: Record<string, any> = {};

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        payload[key] = value.toString();
      });
    } else if (contentType.includes('application/json')) {
      payload = await req.json();
    }

    const messageId = payload.MessageSid || payload.messageId || payload.sid || 'unknown';
    const messageStatus = (payload.MessageStatus || payload.status || 'delivered').toLowerCase();

    console.log(`[SMS WEBHOOK] Reference ID: ${messageId} | Status: ${messageStatus}`);

    return NextResponse.json({
      received: true,
      messageId,
      status: messageStatus,
      timestamp: new Date().toLocaleTimeString()
    });

  } catch (err: any) {
    return NextResponse.json(
      { received: false, error: err?.message || 'Invalid webhook payload' },
      { status: 400 }
    );
  }
}
