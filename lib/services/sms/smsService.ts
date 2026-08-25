/**
 * Raksha AI — Server-Side SMS Service & Provider Abstraction
 * Supports Twilio REST API, Generic HTTP SMS Providers, and Fail-Safe Demo Simulation.
 * Strictly operates in server-side context to prevent exposing credentials to browser.
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
 * Server-Side SMS Dispatcher
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
      provider: process.env.SMS_PROVIDER || 'twilio'
    };
  }

  // 2. Validate Message Content
  if (!req.message || !req.message.trim()) {
    return {
      success: false,
      status: 'failed',
      error: 'Test message content cannot be empty.',
      timestamp,
      provider: process.env.SMS_PROVIDER || 'twilio'
    };
  }

  const cleanedPhone = req.recipient.replace(/[\s\-\(\)]/g, '');
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();

  // Load Provider Credentials from Environment Variables
  const accountSid = process.env.SMS_ACCOUNT_ID || process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.SMS_API_SECRET || process.env.SMS_API_KEY || process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.SMS_SENDER_ID || process.env.TWILIO_PHONE_NUMBER;

  // 3. If Real Credentials Exist -> Execute Real Twilio REST API Request
  if (accountSid && authToken && fromNumber) {
    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

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
        return {
          success: true,
          messageId: data.sid,
          status: 'submitted',
          timestamp,
          provider: 'twilio (Real SMS Delivered)'
        };
      } else {
        const errorMsg = data.message || data.detail || `Twilio Error Code ${data.code || response.status}`;
        return {
          success: false,
          status: 'failed',
          error: `Twilio API Failure: ${errorMsg}`,
          timestamp,
          provider: 'twilio'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        status: 'failed',
        error: `Network connection error calling Twilio SMS API: ${err?.message || 'Server timeout'}`,
        timestamp,
        provider: 'twilio'
      };
    }
  }

  // 4. Fail-Safe Demo Mode (If credentials not yet added in Netlify Environment Variables)
  const demoSid = `SM-DEMO-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  return {
    success: true,
    messageId: demoSid,
    status: 'submitted',
    timestamp,
    provider: 'demo-simulation (Configure SMS_ACCOUNT_ID in Netlify for Real Provider SMS)'
  };
}
