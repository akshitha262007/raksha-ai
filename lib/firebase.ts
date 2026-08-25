import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
}

export function getFirebaseConfig(): FirebaseClientConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!apiKey || !projectId || !messagingSenderId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    messagingSenderId,
    appId,
    vapidKey: vapidKey || ''
  };
}

export async function registerDeviceForPushNotifications(): Promise<{
  success: boolean;
  token?: string;
  deviceName?: string;
  error?: string;
}> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Registration can only be performed in client browser environment.' };
    }

    if (!('Notification' in window)) {
      return { success: false, error: 'This browser does not support Web Push notifications.' };
    }

    const isMessagingSupported = await isSupported();
    if (!isMessagingSupported) {
      return { success: false, error: 'Firebase Web Push Messaging is not supported on this browser context.' };
    }

    // 1. Request Notification Permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Notification permission was denied. Please allow notification permissions in your browser address bar.' };
    }

    // 2. Check Client Firebase Configuration
    const config = getFirebaseConfig();
    if (!config) {
      return {
        success: false,
        error: 'Firebase Web Push is not configured yet. Please configure NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID, and NEXT_PUBLIC_FIREBASE_VAPID_KEY in environment variables.'
      };
    }

    // 3. Initialize Firebase Client App
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    const messaging = getMessaging(app);

    // 4. Register Service Worker with query params
    const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(config.apiKey)}&projectId=${encodeURIComponent(config.projectId)}&messagingSenderId=${encodeURIComponent(config.messagingSenderId)}&appId=${encodeURIComponent(config.appId)}`;
    const swRegistration = await navigator.serviceWorker.register(swUrl);

    // 5. Retrieve FCM Device Token
    const token = await getToken(messaging, {
      vapidKey: config.vapidKey,
      serviceWorkerRegistration: swRegistration
    });

    if (!token) {
      return { success: false, error: 'Failed to retrieve FCM Device Registration Token from Firebase.' };
    }

    const deviceName = `${navigator.platform || 'Web Device'} — ${navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser'}`;

    return {
      success: true,
      token,
      deviceName
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Firebase Web Push Registration Error: ${err?.message || 'Unknown error'}`
    };
  }
}

export function onForegroundPushNotification(callback: (payload: any) => void) {
  if (typeof window === 'undefined') return () => {};

  const config = getFirebaseConfig();
  if (!config) return () => {};

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
      console.log('[Foreground Push Received]:', payload);
      callback(payload);
    });
  } catch (e) {
    return () => {};
  }
}
