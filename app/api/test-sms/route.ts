import { NextRequest, NextResponse } from 'next/server';
import { sendTestSmsViaProvider, validatePhoneNumber } from '@/lib/services/sms/smsService';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Enablement (SMS_ENABLED=true or SMS_TEST_MODE=true)
    const isEnabled = process.env.SMS_ENABLED === 'true' || process.env.SMS_TEST_MODE === 'true';
    if (!isEnabled) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Real SMS sending is not configured yet. Add the SMS provider credentials and enable SMS_ENABLED.' 
        },
        { status: 400 }
      );
    }

    // 2. Parse JSON Request Body
    const body = await req.json();
    const recipientPhone = body.phoneNumber || body.recipient;
    const messageContent = body.message;

    // Safety Enforcer: Reject Bulk / Array Recipient Requests
    if (Array.isArray(recipientPhone) || typeof recipientPhone !== 'string' || !recipientPhone.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please enter a valid phone number including the country code.' 
        },
        { status: 400 }
      );
    }

    // 3. Validate Phone Number Format
    const phoneCheck = validatePhoneNumber(recipientPhone);
    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid phone number including the country code.' },
        { status: 400 }
      );
    }

    // 4. Validate Message Body
    if (!messageContent || typeof messageContent !== 'string' || !messageContent.trim()) {
      return NextResponse.json(
        { success: false, error: 'Test message content is required.' },
        { status: 400 }
      );
    }

    // 5. Dispatch via Server-Side SMS Service
    const result = await sendTestSmsViaProvider({
      recipient: recipientPhone,
      message: messageContent
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to dispatch test SMS.' },
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
