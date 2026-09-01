import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, Messaging, MessagePayload } from 'firebase/messaging';

// Safely configure Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Ensure messaging is supported before initializing (Safari/iOS compatibility)
let messaging: Messaging | null = null;

export const initMessaging = async (): Promise<Messaging | null> => {
  const supported = await isSupported();
  if (supported) {
    messaging = getMessaging(app);
  }
  return messaging;
};

export const getServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration | undefined> => {
  if (!('serviceWorker' in navigator)) return undefined;

  const firebaseConfigObj = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  const configStr = encodeURIComponent(JSON.stringify(firebaseConfigObj));
  const swUrl = '/firebase-messaging-sw.js?config=' + configStr;

  try {
    const registration = await navigator.serviceWorker.register(swUrl);
    // Explicitly check for updates to ensure new versions are fetched
    await registration.update();
    return registration;
  } catch (err) {
    console.error('Service worker registration failed:', err);
    return undefined;
  }
};

export const getFirebaseToken = async (vapidKey?: string): Promise<string | null> => {
  const msg = await initMessaging();
  if (!msg) return null;
  
  try {
    const serviceWorkerRegistration = await getServiceWorkerRegistration();
    return await getToken(msg, { vapidKey, serviceWorkerRegistration });
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const setupOnMessageListener = async (
  callback: (payload: MessagePayload) => void
): Promise<() => void> => {
  const msg = await initMessaging();
  if (msg) {
    // Ensure the service worker is registered and updated when the app initializes
    await getServiceWorkerRegistration();
    return onMessage(msg, callback);
  }
  return () => {};
};

export { app, messaging };
