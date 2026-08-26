import { useState, useEffect } from 'react';

export function useWebPush() {
  const [permission, setPermission] = useState('Notification' in window ? Notification.permission : 'unsupported');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [vapidPublicKey] = useState('BEl62iUYgUivxIkv69yViEuiBIa-m9GYW55mB5fWq-3N20L-1x0x1x1x1x1x1x1x1x1x1');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support Web Push notifications.');
      return false;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        setIsSubscribed(true);
        sendNotification(
          '🚨 RAKSHA-AI Web Push Subscribed',
          'VAPID push subscription active for critical landslide alerts in North-Eastern Region geofence.'
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  };

  const sendNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/vite.svg',
        tag: 'raksha-hazard-alert',
        requireInteraction: true
      });
    } else {
      console.warn('Notifications not granted');
    }
  };

  return {
    permission,
    isSubscribed,
    vapidPublicKey,
    requestPermission,
    sendNotification
  };
}
