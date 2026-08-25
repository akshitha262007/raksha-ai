import { NextRequest, NextResponse } from 'next/server';
import { sendTestSmsViaProvider, validatePhoneNumber } from '@/lib/services/sms/smsService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Parse JSON Request Body
    const body = await req.json();
    const recipientPhone = body.phoneNumber || body.recipient;
    const messageContent = body.message;

    // 2. Validate Recipient Phone Number
    if (!recipientPhone || Array.isArray(recipientPhone) || typeof recipientPhone !== 'string' || !recipientPhone.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please enter a valid phone number including country code (e.g. +919876543210).' 
        },
        { status: 400 }
      );
    }

    // Standardize & Validate Phone Number Format
    const phoneCheck = validatePhoneNumber(recipientPhone);
    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid phone number including country code (e.g. +919876543210).' },
        { status: 400 }
      );
    }

    // 3. Validate Message Content
    if (!messageContent || typeof messageContent !== 'string' || !messageContent.trim()) {
      return NextResponse.json(
        { success: false, error: 'Test message content cannot be empty.' },
        { status: 400 }
      );
    }

    // 4. Dispatch via Server-Side Twilio SMS Service
    const result = await sendTestSmsViaProvider({
      recipient: recipientPhone,
      message: messageContent
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to dispatch SMS via Twilio API.' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      status: result.status || 'Submitted',
      timestamp: result.timestamp,
      provider: result.provider
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Server error processing test SMS: ${err?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
