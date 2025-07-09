import { config } from 'dotenv';
config({ path: '../.env' });
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY!,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.VITE_FIREBASE_APP_ID!,
};

console.log('🔧 Firebase Config:');
console.log('- Project ID:', firebaseConfig.projectId);
console.log('- Auth Domain:', firebaseConfig.authDomain);
console.log('- API Key exists:', !!firebaseConfig.apiKey);

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
  console.log('- App name:', app.name);
  console.log('- Firestore instance created');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}