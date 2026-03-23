import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAZF3kOIGulDRxg-1gzH3NOObe3MCFuzV8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mikmok-a8e81.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mikmok-a8e81",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mikmok-a8e81.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1099107905647",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1099107905647:web:8476f3bdde480bc7675d9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
