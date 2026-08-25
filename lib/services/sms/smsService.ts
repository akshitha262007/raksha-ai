/**
 * Raksha AI — Server-Side Twilio SMS Dispatch Service
 * Integrates directly with Twilio REST API (/2010-04-01/Accounts/{AccountSid}/Messages.json)
 * Operates strictly in server-side context to protect API credentials.
 */

export interface SendSmsRequest {
  recipient: string;
  message: string;
}

export interface SendSmsResponse {
  success: boolean;
  messageId?: string;
  status: 'submitted' | 'delivered' | 'failed';
  error?: string;
  timestamp: string;
  provider: string;
}

/**
 * Validate E.164 / International Phone Number Format
 * E.g., +919876543210 or +12025550123
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Please enter a valid phone number including country code (e.g. +919876543210).' };
  }

  // Remove spaces, dashes, parentheses for clean formatting check
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Must start with '+' followed by 7 to 15 digits (E.164 standard)
  const e164Regex = /^\+[1-9]\d{6,14}$/;

  if (!e164Regex.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid phone number including country code (e.g. +919876543210).' 
    };
  }

  return { isValid: true };
}

/**
 * Mask Phone Number for Public UI Privacy (e.g. +91 98XXXXXX42)
 */
export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.length < 8) return phone;
  const prefix = cleaned.substring(0, 5);
  const suffix = cleaned.substring(cleaned.length - 2);
  return `${prefix}XXXXXX${suffix}`;
}

/**
 * Server-Side Twilio SMS Dispatcher
 */
export async function sendTestSmsViaProvider(req: SendSmsRequest): Promise<SendSmsResponse> {
  const timestamp = new Date().toLocaleTimeString();

  // 1. Validate Phone Number
  const phoneValidation = validatePhoneNumber(req.recipient);
  if (!phoneValidation.isValid) {
    return {
      success: false,
      status: 'failed',
      error: 'Please enter a valid phone number including country code (e.g. +919876543210).',
      timestamp,
      provider: 'Twilio'
    };
  }

  // 2. Validate Message Content
  if (!req.message || !req.message.trim()) {
    return {
      success: false,
      status: 'failed',
      error: 'Test message content cannot be empty.',
      timestamp,
      provider: 'Twilio'
    };
  }

  const cleanedPhone = req.recipient.replace(/[\s\-\(\)]/g, '');

  // 3. Extract Twilio Credentials from Environment Variables
  const accountSid = (process.env.TWILIO_ACCOUNT_SID || process.env.SMS_ACCOUNT_ID || '').trim();
  const authUsername = (process.env.TWILIO_API_KEY_SID || process.env.TWILIO_ACCOUNT_SID || process.env.SMS_ACCOUNT_ID || '').trim();
  const authPassword = (process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN || process.env.SMS_API_SECRET || process.env.SMS_API_KEY || '').trim();
  const fromNumber = (process.env.TWILIO_PHONE_NUMBER || process.env.SMS_SENDER_ID || '').trim();

  // Diagnostic Check for Missing Variables
  const missingFields: string[] = [];
  if (!accountSid) missingFields.push('TWILIO_ACCOUNT_SID (or SMS_ACCOUNT_ID)');
  if (!authPassword) missingFields.push('TWILIO_API_SECRET / TWILIO_AUTH_TOKEN (or SMS_API_SECRET)');
  if (!fromNumber) missingFields.push('TWILIO_PHONE_NUMBER (or SMS_SENDER_ID)');

  if (missingFields.length > 0) {
    return {
      success: false,
      status: 'failed',
      error: `Twilio credentials missing on Netlify server. Missing variables: ${missingFields.join(', ')}. Please check Netlify Environment Variables.`,
      timestamp,
      provider: 'Twilio'
    };
  }

  // 4. Dispatch Real Request to Twilio Messages API Endpoint
  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const authHeader = 'Basic ' + Buffer.from(`${authUsername}:${authPassword}`).toString('base64');

    const bodyData = new URLSearchParams({
      To: cleanedPhone,
      From: fromNumber,
      Body: req.message
    });

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyData.toString()
    });

    const data = await response.json();

    if (response.ok && data.sid) {
      let mappedStatus: 'submitted' | 'delivered' | 'failed' = 'submitted';
      if (data.status === 'delivered') mappedStatus = 'delivered';
      if (data.status === 'failed' || data.status === 'undelivered') mappedStatus = 'failed';

      return {
        success: true,
        messageId: data.sid,
        status: mappedStatus,
        timestamp,
        provider: 'Twilio REST API'
      };
    } else {
      const errorMsg = data.message || data.detail || `Twilio Code ${data.code || response.status}`;
      return {
        success: false,
        status: 'failed',
        error: `Twilio API Error ${data.code || response.status}: ${errorMsg}`,
        timestamp,
        provider: 'Twilio REST API'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      status: 'failed',
      error: `Server network error dispatching to Twilio API: ${err?.message || 'Connection failed'}`,
      timestamp,
      provider: 'Twilio REST API'
    };
  }
}
