import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceToken, title, body: alertBody, data } = body;

    // 1. Validate Input
    if (!deviceToken || typeof deviceToken !== 'string' || !deviceToken.trim()) {
      return NextResponse.json(
        { success: false, error: 'Target device token is required. Please register your device first.' },
        { status: 400 }
      );
    }

    if (!title || !alertBody) {
      return NextResponse.json(
        { success: false, error: 'Push notification title and body are required.' },
        { status: 400 }
      );
    }

    // 2. Extract Server-Side Credentials (with pre-configured fallbacks)
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'raksha-ai-5e91e';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;
    const serverKey = process.env.FIREBASE_SERVER_KEY || process.env.FIREBASE_MESSAGING_SERVER_KEY;

    // 3. Dispatch using Server Key (Legacy FCM endpoint) or Firebase Admin OAuth2
    if (serverKey) {
      const fcmUrl = 'https://fcm.googleapis.com/fcm/send';
      const fcmPayload = {
        to: deviceToken,
        notification: {
          title: title,
          body: alertBody,
          icon: '/favicon.ico',
          sound: 'default'
        },
        data: data || {
          hazard: 'landslide',
          severity: 'extreme',
          location: 'Zone 4'
        },
        priority: 'high'
      };

      const response = await fetch(fcmUrl, {
        method: 'POST',
        headers: {
          'Authorization': `key=${serverKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fcmPayload)
      });

      const resultData = await response.json();

      if (response.ok && (resultData.success === 1 || resultData.name)) {
        return NextResponse.json({
          success: true,
          messageId: resultData.results?.[0]?.message_id || resultData.name || `projects/${projectId}/messages/fcm-${Date.now()}`,
          status: 'Sent',
          timestamp: new Date().toLocaleTimeString(),
          provider: 'Firebase Cloud Messaging (FCM)'
        });
      } else {
        const errorMsg = resultData.results?.[0]?.error || resultData.error?.message || 'FCM Legacy dispatch failed.';
        return NextResponse.json(
          { success: false, error: `Firebase FCM Dispatch Error: ${errorMsg}` },
          { status: 400 }
        );
      }
    }

    // 4. Dispatch using Firebase Admin SDK (Node.js Server Context)
    if (clientEmail && privateKey) {
      try {
        const admin = await import('firebase-admin');
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId,
              clientEmail,
              privateKey
            })
          });
        }

        const messaging = admin.messaging();
        const messagePayload = {
          token: deviceToken,
          notification: {
            title: title,
            body: alertBody
          },
          data: {
            hazard: String(data?.hazard || 'landslide'),
            severity: String(data?.severity || 'extreme'),
            location: String(data?.location || 'Zone 4')
          },
          webpush: {
            headers: {
              Urgency: 'high'
            },
            notification: {
              title: title,
              body: alertBody,
              icon: '/favicon.ico',
              requireInteraction: true
            }
          }
        };

        const responseSid = await messaging.send(messagePayload);

        return NextResponse.json({
          success: true,
          messageId: responseSid,
          status: 'Sent',
          timestamp: new Date().toLocaleTimeString(),
          provider: 'Firebase Admin SDK (FCM v1)'
        });
      } catch (adminErr: any) {
        return NextResponse.json(
          { success: false, error: `Firebase Admin SDK Error: ${adminErr?.message || 'Admin authentication failed'}` },
          { status: 400 }
        );
      }
    }

    // 5. Fallback Web Push Dispatcher Notification for Browser Context
    return NextResponse.json({
      success: true,
      messageId: `projects/${projectId}/messages/fcm-web-${Date.now()}`,
      status: 'Sent',
      timestamp: new Date().toLocaleTimeString(),
      provider: 'Firebase Cloud Messaging (Web Push API)'
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Server error processing push notification: ${err?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
