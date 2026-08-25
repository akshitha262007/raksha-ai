import { NextRequest, NextResponse } from 'next/server';
import { sendTestSmsViaProvider, validatePhoneNumber } from '@/lib/services/sms/smsService';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Test Mode Requirement
    const testMode = process.env.SMS_TEST_MODE;
    if (testMode !== 'true') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Real SMS sending is not enabled. Configure the SMS provider and enable test mode in environment variables (SMS_TEST_MODE=true).' 
        },
        { status: 400 }
      );
    }

    // 2. Parse JSON Request Body
    const body = await req.json();
    const { recipient, message } = body;

    // Safety Enforcer: Reject Bulk / Array Recipient Requests
    if (Array.isArray(recipient) || typeof recipient !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bulk SMS sending is blocked on this MVP endpoint. Only one single recipient phone number is allowed.' 
        },
        { status: 400 }
      );
    }

    // 3. Validate Phone Number Format
    const phoneCheck = validatePhoneNumber(recipient);
    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: phoneCheck.error },
        { status: 400 }
      );
    }

    // 4. Validate Message Body
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Test message content is required.' },
        { status: 400 }
      );
    }

    // 5. Dispatch via Server-Side SMS Service
    const result = await sendTestSmsViaProvider({
      recipient,
      message
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
      status: result.status,
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
