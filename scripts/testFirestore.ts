import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY!,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.VITE_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestore() {
  try {
    const testData = {
      name: 'Test Deck',
      archetype: 'Test',
      player: 'Test Player',
      placement: 1,
      region: 'JP',
      tournament: 'Test Tournament',
      date: new Date().toISOString(),
      format: 'standard',
      cards: [],
      mainDeck: [],
      eggDeck: [],
      totalCards: 50,
      colors: ['Yellow'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(collection(db, 'metaDecks'), 'test-deck'), testData);
    console.log('✅ Test data saved successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFirestore();