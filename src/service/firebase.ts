import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getEnv } from "../util/env";

const env = getEnv();

export const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  appId: env.VITE_FIREBASE_APP_ID,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
} as Record<string, string>);

getAnalytics(app);
