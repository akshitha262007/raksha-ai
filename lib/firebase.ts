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

export function getFirebaseConfig(): FirebaseClientConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAEJgyo236nSN3o10MJ4XEcK1rJEeMAQEk',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'raksha-ai-5e91e.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'raksha-ai-5e91e',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'raksha-ai-5e91e.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1008970376200',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1008970376200:web:5cc9d85dcb578b9cae5dbd',
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || ''
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

    // 2. Get Client Firebase Configuration
    const config = getFirebaseConfig();

    // 3. Initialize Firebase Client App
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    const messaging = getMessaging(app);

    // 4. Register Service Worker & Wait until Active
    const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(config.apiKey)}&projectId=${encodeURIComponent(config.projectId)}&messagingSenderId=${encodeURIComponent(config.messagingSenderId)}&appId=${encodeURIComponent(config.appId)}`;
    await navigator.serviceWorker.register(swUrl);
    const swRegistration = await navigator.serviceWorker.ready;

    // 5. Retrieve FCM Device Token
    const token = await getToken(messaging, {
      ...(config.vapidKey ? { vapidKey: config.vapidKey } : {}),
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
